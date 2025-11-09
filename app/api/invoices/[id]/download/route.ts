/**
 * Download Invoice PDF API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        payment:payments(*),
        application:visa_applications(
          application_number,
          visa_type:visa_types(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Check ownership or admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.preferences?.role === 'admin';
    const isOwner = invoice.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate PDF HTML
    const html = generateInvoiceHTML(invoice);

    // For now, return HTML (TODO: Convert to PDF using puppeteer or similar)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoice_number}.html"`,
      },
    });

    // TODO: Convert HTML to PDF and return PDF
    // const pdf = await generatePDF(html);
    // return new NextResponse(pdf, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
    //   },
    // });
  } catch (error: any) {
    console.error('Download invoice error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate invoice HTML
function generateInvoiceHTML(invoice: any): string {
  const company = invoice.company_details;
  const customer = invoice.customer_details;
  const items = invoice.line_items;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company { font-size: 24px; font-weight: bold; color: #667eea; }
        .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
        .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .text-right { text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; background-color: #f0f0f0; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company">${company.name}</div>
          <div>${company.address}</div>
          <div>${company.phone}</div>
          <div>${company.email}</div>
          <div>GSTIN: ${company.gstin}</div>
        </div>
        <div style="text-align: right;">
          <div class="invoice-title">INVOICE</div>
          <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
          <div><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString()}</div>
          <div><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID</span></div>
        </div>
      </div>

      <div class="details">
        <div>
          <h3>Bill To:</h3>
          <div><strong>${customer.name}</strong></div>
          <div>${customer.email}</div>
          <div>${customer.phone}</div>
        </div>
        <div style="text-align: right;">
          <h3>Application:</h3>
          <div><strong>${invoice.application?.application_number}</strong></div>
          <div>${invoice.application?.visa_type?.name}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item: any) => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">₹${item.unitPrice.toLocaleString('en-IN')}</td>
              <td class="text-right">₹${item.total.toLocaleString('en-IN')}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
            <td class="text-right">₹${invoice.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-right"><strong>GST (18%):</strong></td>
            <td class="text-right">₹${invoice.tax_amount.toLocaleString('en-IN')}</td>
          </tr>
          ${
            invoice.discount_amount > 0
              ? `
          <tr>
            <td colspan="3" class="text-right" style="color: green;"><strong>Discount:</strong></td>
            <td class="text-right" style="color: green;">-₹${invoice.discount_amount.toLocaleString('en-IN')}</td>
          </tr>
          `
              : ''
          }
          <tr class="total-row">
            <td colspan="3" class="text-right">TOTAL:</td>
            <td class="text-right">₹${invoice.total_amount.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 40px;">
        <h4>Payment Details:</h4>
        <div>Payment Method: ${invoice.payment?.payment_method || 'Online'}</div>
        <div>Transaction ID: ${invoice.payment?.razorpay_payment_id || 'N/A'}</div>
        <div>Payment Date: ${new Date(invoice.payment?.captured_at || invoice.created_at).toLocaleString()}</div>
        <div style="color: green; font-weight: bold; margin-top: 10px;">✓ PAYMENT RECEIVED</div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
        <p>For any queries, please contact ${company.email} or ${company.phone}</p>
      </div>
    </body>
    </html>
  `;
}


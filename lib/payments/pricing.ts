/**
 * Pricing Calculation Utilities
 * Fresh pricing validation before payment
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface PricingDetails {
  visaPrice: number;
  travelerCount: number;
  totalVisaPrice: number;
  addons: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  addonsTotal: number;
  processingFee: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  currency: string;
}

export async function calculateApplicationPricing(
  applicationId: string
): Promise<PricingDetails> {
  const supabase = createClientComponentClient();

  // 1. Get application with visa type
  const { data: application, error: appError } = await supabase
    .from('visa_applications')
    .select(`
      *,
      visa_type:visa_types(
        id,
        name,
        price
      )
    `)
    .eq('id', applicationId)
    .single();

  if (appError || !application) {
    throw new Error('Application not found');
  }

  const basePrice = application.visa_type.price || 0;

  // 2. Get travelers count
  const { data: travelers } = await supabase
    .from('visa_travelers')
    .select('id')
    .eq('application_id', applicationId);

  const travelerCount = travelers?.length || 1;
  const totalVisaPrice = basePrice * travelerCount;

  // 3. Get add-ons
  const { data: applicationAddons } = await supabase
    .from('visa_application_addons')
    .select(`
      *,
      addon:visa_addons(
        id,
        name,
        price,
        per_traveler
      )
    `)
    .eq('application_id', applicationId);

  const addons =
    applicationAddons?.map((aa) => ({
      id: aa.addon.id,
      name: aa.addon.name,
      price: aa.addon.price,
      quantity: aa.addon.per_traveler ? travelerCount : 1,
      total: aa.addon.price * (aa.addon.per_traveler ? travelerCount : 1),
    })) || [];

  const addonsTotal = addons.reduce((sum, addon) => sum + addon.total, 0);

  // 4. Calculate processing fee (3% of visa + addons)
  const processingFeeRate = 0.03;
  const processingFee = Math.round((totalVisaPrice + addonsTotal) * processingFeeRate);

  // 5. Calculate subtotal
  const subtotal = totalVisaPrice + addonsTotal + processingFee;

  // 6. Calculate tax (18% GST in India)
  const taxRate = 0.18;
  const taxAmount = Math.round(subtotal * taxRate);

  // 7. Apply discounts (if any)
  // TODO: Implement discount/coupon system
  const discountAmount = 0;
  const discountCode = undefined;

  // 8. Calculate total
  const total = subtotal + taxAmount - discountAmount;

  return {
    visaPrice: basePrice,
    travelerCount,
    totalVisaPrice,
    addons,
    addonsTotal,
    processingFee,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    discountCode,
    total,
    currency: 'INR',
  };
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatAmount(amountInPaise: number): number {
  return amountInPaise / 100;
}

export function toRazorpayAmount(amount: number): number {
  // Convert rupees to paise
  return Math.round(amount * 100);
}

export function fromRazorpayAmount(amountInPaise: number): number {
  // Convert paise to rupees
  return amountInPaise / 100;
}


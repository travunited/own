# Admin Dashboard - Quick Reference Guide

## 🎯 Quick Overview

### Main Sections
```
📊 Overview          - KPIs, charts, quick stats
📄 Visa Management   - Applications, queue, processing
✈️  Tour Management   - Tours, bookings, departures
👥 User Management   - Customers, staff, access
💳 Finance           - Payments, refunds, reports
🎫 Support          - Tickets, templates, responses
📝 Content          - Blog, pages, banners
📊 Reports          - Analytics, business reports
⚙️  Settings         - Configuration, integrations
```

---

## 👤 User Roles

### Quick Role Reference

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Super Admin** | Everything | Nothing restricted |
| **Ops Head** | Manage team, all operations | System settings |
| **Visa Ops** | Process visas, documents | Payments, refunds |
| **Tour Ops** | Manage tours, bookings | Visa operations |
| **Finance** | Payments, refunds, reports | Operations |
| **Support** | Tickets, communication | Approve/reject |
| **Content** | Blog, pages, banners | Operations |

---

## 🔢 Dashboard KPIs

### Visa Section
- Pending Review: Applications awaiting admin action
- In Progress: Currently being processed
- Approved Today: Successfully approved visas
- Success Rate: Approval percentage
- SLA Breaches: Applications past deadline

### Tour Section
- Active Bookings: Confirmed bookings
- Revenue Today: Sales today
- Available Tours: Live tour packages
- Occupancy Rate: Seat fill percentage

### Finance
- Today's Revenue: Total collected
- Pending Payments: Awaiting payment
- Refunds: Processed refunds
- Net Revenue: After refunds

### Support
- Open Tickets: Active support cases
- Pending Response: Awaiting admin reply
- Avg Response Time: Time to first response
- Resolution Rate: Tickets resolved %

---

## ⚡ Quick Actions

### Common Tasks

**Review Visa Application:**
```
1. Go to Visa Management
2. Click on application
3. Review travellers tab
4. Check documents tab
5. Approve/reject each document
6. Update status
7. Add notes if needed
8. Save changes
```

**Process Refund:**
```
1. Go to Finance → Refunds
2. Find refund request
3. Review reason and amount
4. Calculate deductions
5. Approve/reject
6. System processes automatically
7. Customer notified
```

**Respond to Ticket:**
```
1. Go to Support Center
2. Open ticket
3. Read conversation
4. Use template (optional)
5. Type response
6. Send or save draft
7. Update ticket status
```

**Create Tour:**
```
1. Go to Tour Management
2. Click "Create New Tour"
3. Fill basic info
4. Add itinerary
5. Upload images
6. Set pricing
7. Add departures
8. Publish
```

---

## 🔍 Search & Filters

### Global Search
- Available in header
- Searches: Applications, Users, Orders, Tickets
- Shortcut: `Ctrl/Cmd + K`

### Application Filters
- **Status**: All, Pending, Under Review, Approved, etc.
- **Country**: Filter by destination
- **Date Range**: Custom date picker
- **Assigned To**: Filter by team member
- **SLA**: On time, Due soon, Overdue

### Sort Options
- Date (Newest/Oldest)
- Amount (High/Low)
- SLA Urgency
- Status
- Customer Name

---

## 📋 Application Statuses

### Status Flow
```
DRAFT
  ↓
PAYMENT_PENDING
  ↓
DOCS_PENDING
  ↓
UNDER_REVIEW ← Admin processes here
  ↓
SUBMITTED_TO_EMBASSY
  ↓
IN_PROGRESS
  ↓
APPROVED / REJECTED
  ↓
DISPATCHED
```

### When to Use Each Status

| Status | When | Next Action |
|--------|------|-------------|
| DOCS_PENDING | Customer hasn't uploaded all | Send reminder |
| UNDER_REVIEW | You're checking documents | Approve/reject |
| SUBMITTED_TO_EMBASSY | Sent to embassy | Wait for response |
| APPROVED | Embassy approved | Dispatch visa |
| REJECTED | Embassy rejected | Inform customer |

---

## 📄 Document Review

### Checklist for Each Document

**Passport Copy:**
- ☐ Clear and readable
- ☐ All corners visible
- ☐ Expiry date > 6 months
- ☐ No damage or tampering
- ☐ Matches traveller name

**Passport Photo:**
- ☐ White background only
- ☐ Recent (< 6 months)
- ☐ Face clearly visible
- ☐ No glasses/hat
- ☐ Proper lighting

**Flight Tickets:**
- ☐ Valid dates
- ☐ Destination matches
- ☐ Passenger names match
- ☐ Booking confirmed

**Hotel Booking:**
- ☐ Valid dates
- ☐ Location confirmed
- ☐ Guest names match
- ☐ Paid/confirmed status

### Action Buttons
- **✅ Approve**: Document is good
- **❌ Reject**: Request re-upload
- **👁️ Preview**: View full size
- **⬇️ Download**: Save locally

---

## 💰 Payment Management

### Payment Status
- **SUCCESS**: Completed successfully
- **PENDING**: Processing
- **FAILED**: Payment declined
- **REFUNDED**: Money returned

### Refund Guidelines

**Full Refund When:**
- Technical error
- Service cancelled by us
- Duplicate payment

**Partial Refund When:**
- Visa rejected (minus processing)
- Customer cancellation (policy-based)

**No Refund When:**
- After embassy submission
- Customer error after approval

### Processing Time
- Instant refund approval
- 5-7 business days to customer account

---

## 🎫 Support Priorities

### Priority Levels

| Priority | Response Time | Examples |
|----------|--------------|----------|
| 🔴 **High** | < 2 hours | Payment issues, urgent travel |
| 🟠 **Medium** | < 6 hours | Document problems, status query |
| 🟢 **Low** | < 24 hours | General questions, feedback |

### Response Templates

**Document Issue:**
```
Hi [Name],

Thank you for reaching out. I've reviewed your 
application [ID]. 

[Specific issue and solution]

Please let me know if you need any assistance.

Best regards,
Team Travunited
```

**Status Update:**
```
Hi [Name],

Your visa application [ID] status has been 
updated to [STATUS].

[Next steps]

You can track your application at: [LINK]

Best regards,
Team Travunited
```

---

## 📊 Reports Quick Access

### Most Used Reports

**Daily Sales Report:**
- Revenue by service
- Payment methods
- Success rate
- Export: CSV/PDF

**Application Summary:**
- New applications
- Status breakdown
- Processing time
- Team performance

**Financial Report:**
- Revenue vs targets
- Refund summary
- Outstanding payments
- Reconciliation

**Support Report:**
- Ticket volume
- Resolution time
- Satisfaction score
- Common issues

---

## ⚙️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Global Search | `Ctrl/Cmd + K` |
| Save | `Ctrl/Cmd + S` |
| Refresh Data | `F5` |
| Next Item | `→` or `J` |
| Previous Item | `←` or `K` |
| Open Detail | `Enter` |
| Close Modal | `Esc` |
| Select All | `Ctrl/Cmd + A` |
| Copy | `Ctrl/Cmd + C` |

---

## 🚨 Alert Types

### System Alerts

**⚠️ SLA Breach Warning**
- Application past deadline
- Action: Process immediately

**🔴 Payment Failed**
- Transaction declined
- Action: Contact customer

**📄 Document Issue**
- Missing/invalid document
- Action: Request re-upload

**💰 Refund Pending**
- Awaiting approval
- Action: Review and approve

---

## 📞 Quick Contacts

### Internal Team
- **Ops Head**: ops@travunited.com
- **Tech Support**: tech@travunited.com
- **Finance**: finance@travunited.com
- **Emergency**: +91 123 456 7890

### External
- **Razorpay Support**: support@razorpay.com
- **Embassy Contacts**: [As per country]

---

## 🔐 Security Best Practices

### Do's
- ✅ Logout when leaving desk
- ✅ Use strong password
- ✅ Enable 2FA
- ✅ Keep browser updated
- ✅ Verify before approving
- ✅ Add notes for actions

### Don'ts
- ❌ Share login credentials
- ❌ Leave session unattended
- ❌ Process without verification
- ❌ Skip document review
- ❌ Approve bulk without checking

---

## 📝 Daily Checklist

### Morning (Start of Day)
- [ ] Check pending applications
- [ ] Review overnight tickets
- [ ] Check SLA breaches
- [ ] Review team assignments
- [ ] Check payment issues

### Throughout Day
- [ ] Process applications
- [ ] Respond to tickets
- [ ] Update statuses
- [ ] Add internal notes
- [ ] Communicate with customers

### Evening (End of Day)
- [ ] Complete pending reviews
- [ ] Update all statuses
- [ ] Respond to urgent tickets
- [ ] Prepare tomorrow's queue
- [ ] Generate daily report

---

## 🎯 Performance Targets

### Individual KPIs
- Applications processed: 15-20/day
- Avg processing time: < 4 hours
- Document approval rate: 95%+
- Ticket response time: < 2 hours
- Customer satisfaction: 4.5+/5

### Team KPIs
- Daily application target: 100+
- Visa success rate: 99%+
- Support resolution: 90%+
- Revenue target: As per plan
- SLA compliance: 95%+

---

## 🛠️ Troubleshooting

### Common Issues

**Can't see application:**
- Check filters (might be filtered out)
- Verify permissions
- Refresh page

**Document won't load:**
- Check internet connection
- Try different browser
- Clear cache
- Contact tech support

**Payment not reflecting:**
- Check Razorpay dashboard
- Verify webhook logs
- Wait 5 minutes (processing time)
- Reconcile manually if needed

**Can't approve refund:**
- Check permission level
- Verify refund amount
- Ensure sufficient balance
- Contact finance team

---

## 📖 Training Resources

### New Admin Onboarding
1. Platform overview (30 min)
2. Visa processing flow (1 hour)
3. Document review (1 hour)
4. Support handling (30 min)
5. Reports & analytics (30 min)

### Quick Videos
- Application processing (5 min)
- Document review (3 min)
- Refund processing (4 min)
- Ticket management (3 min)

---

## ✅ Success Metrics

### Quality Indicators
- Zero SLA breaches
- High customer satisfaction
- Fast processing time
- Low rejection rate
- Positive feedback

### Efficiency Indicators
- High throughput
- Low error rate
- Quick response time
- Accurate documentation
- Proper note-taking

---

**Quick Reference Version**: 1.0  
**Last Updated**: November 8, 2024  
**Print & Keep Handy**: Essential for daily work  



# Visa Booking Process - Quick Reference Guide

## 📊 Process at a Glance

### 6-Step User Flow
```
1. SELECT VISA      → 5 min   → Choose country & type
2. TRAVELLERS       → 10 min  → Add traveller details
3. DOCUMENTS        → 15 min  → Upload required docs
4. ADD-ONS          → 5 min   → Select extra services
5. REVIEW           → 5 min   → Confirm all details
6. PAYMENT          → 2 min   → Complete payment
```

**Total User Time**: 40-45 minutes  
**Success Rate Target**: 99%+

---

## 🎯 Key Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Page Load Time | < 2s | Yes |
| Payment Success | 95%+ | Yes |
| Document Upload | 100% | Yes |
| User Drop-off | < 20% | Yes |
| Admin Response | < 24h | Yes |

---

## 💾 Database Tables Used

### Primary Tables
1. `visa_applications` - Main application record
2. `visa_applicants` - Per-traveller data
3. `visa_documents` - Uploaded documents
4. `orders` - Payment orders
5. `payments` - Payment transactions
6. `application_timeline` - Status history

### Reference Tables
- `visa_countries` - Country list
- `visa_types` - Visa type configurations
- `visa_required_documents` - Document requirements
- `users` - User accounts
- `traveller_profiles` - Saved traveller data

---

## 🔄 Status Flow

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LIFECYCLE                 │
└─────────────────────────────────────────────────────────┘

DRAFT
  │ User creates application
  ↓
PAYMENT_PENDING
  │ User initiates payment
  ↓
PAYMENT_SUCCESSFUL (internal state)
  │ Payment verified
  ↓
DOCS_PENDING
  │ Waiting for all documents
  ↓
UNDER_REVIEW
  │ Admin reviewing (24-48h)
  ↓
SUBMITTED_TO_EMBASSY
  │ Sent to embassy
  ↓
IN_PROGRESS
  │ Embassy processing (2-30 days)
  ↓
APPROVED ────────────────→ DISPATCHED
  │                           │
  │ Visa received          Sent to user
  │
  ↓
REJECTED
  │
  End (No refund)
```

---

## 💰 Pricing Calculation

```typescript
// Base Calculation
Base Price = Visa Type Price × Number of Travellers

// Add-ons
Express Processing = ₹2,000 × Travellers (if selected)
Document Verification = ₹500 (one-time)
Travel Insurance = ₹800 × Travellers (if selected)
Premium Support = ₹300 (one-time)

// Final Amount
Subtotal = Base + Add-ons
Tax (GST) = Subtotal × 18%
Grand Total = Subtotal + Tax
```

**Example:**
- Dubai Tourist Visa: ₹5,499
- 2 Travellers: ₹5,499 × 2 = ₹10,998
- Express: ₹2,000 × 2 = ₹4,000
- Insurance: ₹800 × 2 = ₹1,600
- **Subtotal**: ₹16,598
- **GST (18%)**: ₹2,988
- **Grand Total**: ₹19,586

---

## 📄 Document Requirements

### Mandatory Documents (All Countries)
1. ✅ Passport Copy (First & Last page)
2. ✅ Passport Photo (White background)
3. ✅ Flight Tickets (Confirmed/Tentative)
4. ✅ Hotel Booking

### Optional Documents
- Bank Statement (6 months)
- Employment Letter
- ITR/Tax Returns
- Invitation Letter (if applicable)

### File Specifications
- **Formats**: PDF, JPG, PNG
- **Max Size**: 5MB per document
- **Photo Size**: 2MB max
- **Quality**: Clear, readable, no blur

---

## 🔐 Security Checks

### Pre-Payment
- [ ] All travellers have valid passports (6+ months)
- [ ] No duplicate passport numbers
- [ ] All mandatory documents uploaded
- [ ] User accepted terms & conditions

### Payment Verification
- [ ] Razorpay signature verified
- [ ] Amount matches order amount
- [ ] Payment status is SUCCESS
- [ ] No duplicate payments

### Admin Review
- [ ] Document quality acceptable
- [ ] Information matches passport
- [ ] All requirements met
- [ ] No red flags

---

## 📧 Notification Schedule

### Email Notifications
| Event | Timing | Template |
|-------|--------|----------|
| Application Created | Immediate | Welcome + Details |
| Payment Success | Immediate | Receipt + Next Steps |
| Documents Received | Immediate | Confirmation |
| Under Review | When started | Progress Update |
| Document Issue | When found | Action Required |
| Submitted to Embassy | When done | Status Update |
| Approved | When received | Congratulations |
| Rejected | When received | Regret + Support |
| Dispatched | When sent | Tracking Info |

### SMS Notifications
- Payment confirmation
- Application submitted
- Visa approved/rejected
- Critical updates only

---

## ⚡ Quick Actions

### For Users
```bash
# Track Application
Visit: /track
Enter: Application Number + Email/Phone

# View Dashboard
Visit: /dashboard
See: All applications + status

# Download Receipt
Dashboard → Application → Download Invoice

# Upload Missing Document
Dashboard → Application → Upload Document

# Contact Support
Email: support@travunited.com
Phone: +91 123 456 7890
WhatsApp: Available
```

### For Admins
```bash
# Review Application
Admin → Applications → [ID] → Review

# Approve Document
Application → Documents → [Document] → Approve

# Update Status
Application → Status → Select New Status → Save

# Send Message
Application → Communication → Send Message

# Generate Report
Admin → Reports → Select Period → Export
```

---

## 🚨 Error Handling

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Payment failed | Retry payment, check card details |
| Document upload failed | Check file size/format, retry |
| Passport expired | Update passport, re-submit |
| Missing documents | Upload from dashboard |
| Status not updating | Check admin panel, refresh |

### Emergency Contacts
- **Technical**: dev@travunited.com
- **Support**: support@travunited.com
- **Payment**: payments@travunited.com
- **Admin**: admin@travunited.com

---

## 📊 Performance Benchmarks

### Response Times
- API Calls: < 500ms
- Document Upload: < 5s per file
- Payment Processing: < 30s
- Status Update: Real-time
- Email Delivery: < 2 minutes

### Availability
- System Uptime: 99.9%
- Payment Gateway: 99.95%
- Database: 99.99%
- Storage: 99.9%

---

## 🔧 Technical Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod

### Backend
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Storage (S3)
- Supabase Auth

### Third-Party
- Razorpay (Payments)
- Email Service (To configure)
- SMS Gateway (To configure)

---

## 📝 Testing Checklist

### Before Production
- [ ] Happy path testing
- [ ] Payment success scenario
- [ ] Payment failure scenario
- [ ] Document upload/delete
- [ ] Status transitions
- [ ] Email/SMS sending
- [ ] Admin operations
- [ ] Error handling
- [ ] Security testing
- [ ] Load testing

### Test Data
```
Test Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
OTP: 123456 (in test mode)
```

---

## 🎓 Training Materials

### For Support Team
1. Application lifecycle
2. Document requirements per country
3. Common user queries
4. Troubleshooting guide
5. Escalation process

### For Admin Team
1. Review process
2. Document verification
3. Status management
4. Embassy coordination
5. User communication

---

## 📞 Support Contacts

### User Facing
- **General**: support@travunited.com
- **Phone**: +91 123 456 7890
- **WhatsApp**: +91 123 456 7890
- **Hours**: 9 AM - 7 PM (Mon-Sat)

### Internal
- **Tech Support**: tech@travunited.com
- **Ops Team**: ops@travunited.com
- **Finance**: finance@travunited.com
- **Emergency**: 24/7 hotline

---

## 🔄 Regular Maintenance

### Daily
- [ ] Monitor application queue
- [ ] Check payment reconciliation
- [ ] Review support tickets
- [ ] Update application statuses

### Weekly
- [ ] Generate reports
- [ ] Review metrics
- [ ] Update documentation
- [ ] Team sync meeting

### Monthly
- [ ] System health check
- [ ] Performance review
- [ ] User feedback analysis
- [ ] Process improvements

---

**Quick Reference Version**: 1.0  
**Last Updated**: November 8, 2024  
**Print This**: For desk reference  



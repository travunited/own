# Travunited - Visa & Tour Booking Platform

A comprehensive travel platform offering visa application services and curated tour packages. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Services
- **Visa Services**: Multi-country, multi-visa-type applications with document management and real-time tracking
- **Tour Packages**: Curated domestic and international tours with optional visa bundling

### User Features
- **Multi-traveller Support**: Apply for visas for multiple travelers in one go
- **Document Vault**: Securely store and manage travel documents
- **Real-time Tracking**: Track visa applications and tour bookings
- **Smart Dashboard**: Unified view of all bookings, payments, and pending actions
- **Support System**: Integrated ticket system with chat functionality

### Platform Capabilities
- OTP-based authentication (phone/email)
- Razorpay payment integration
- Document upload and verification workflow
- Status timeline for applications
- Notifications via email/SMS
- Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Razorpay
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **File Upload**: React Dropzone

## 📁 Project Structure

```
Travunited/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── track/                    # Track application
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── visas/                    # Visa listing and details
│   ├── tours/                    # Tour listing and details
│   ├── visa-apply/               # Visa application flow (6 steps)
│   ├── dashboard/                # User dashboard
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── VisaSearchCard.tsx
│   ├── TourSearchCard.tsx
│   ├── visa-apply/               # Visa application step components
│   │   ├── SelectVisaStep.tsx
│   │   ├── TravellersStep.tsx
│   │   ├── DocumentsStep.tsx
│   │   ├── AddonsStep.tsx
│   │   ├── ReviewStep.tsx
│   │   └── PaymentStep.tsx
│   └── dashboard/                # Dashboard components
├── lib/                          # Utility functions
│   ├── utils.ts                  # Helper functions
│   └── supabase.ts               # Supabase client
├── types/                        # TypeScript type definitions
│   └── database.ts               # Database schema types
├── public/                       # Static assets
└── Configuration files
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

## 🗄️ Database Schema

### Core Entities

1. **User**: Customer profiles with authentication
2. **TravellerProfile**: Saved traveler information for quick reuse
3. **VisaCountry**: Countries offering visa services
4. **VisaType**: Different visa categories per country
5. **VisaApplication**: Visa application headers
6. **VisaApplicant**: Per-traveller application data
7. **VisaDocument**: Document uploads per applicant
8. **Tour**: Tour package details
9. **TourDeparture**: Date-wise tour inventory
10. **TourBooking**: Tour booking records
11. **Order**: Payment order records
12. **Payment**: Payment transaction details
13. **Refund**: Refund processing
14. **SupportTicket**: Customer support tickets
15. **Notification**: User notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travunited
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Key User Flows

### Visa Application Flow

1. **Select Visa**: Choose country, visa type, and processing speed
2. **Add Travellers**: Enter details for all travelers
3. **Upload Documents**: Submit required documents per traveller
4. **Choose Add-ons**: Select optional services (insurance, express processing)
5. **Review**: Verify all details
6. **Payment**: Complete secure payment via Razorpay

### Tour Booking Flow

1. Search/browse tours by destination, dates, and preferences
2. View detailed itinerary and inclusions
3. Select dates and add travelers
4. Optionally add visa processing
5. Complete payment
6. Receive vouchers and booking confirmation

## 💳 Payment Integration (Razorpay)

The platform uses Razorpay for secure payment processing:

- **Order Creation**: Backend creates Razorpay order
- **Checkout**: Frontend displays Razorpay checkout modal
- **Verification**: Backend verifies payment signature
- **Webhooks**: Real-time payment status updates
- **Refunds**: Admin-initiated refund processing

## 🎨 Design Philosophy

- **MakeMyTrip-level polish**: Familiar, intuitive interface
- **Atlys/Atlas Visa clarity**: Clear information hierarchy
- **Mobile-first**: Optimized for all screen sizes
- **Minimal friction**: Streamlined booking flows
- **Trust signals**: Prominent security and credibility indicators

## 🔐 Security Features

- OTP-based authentication
- Secure document storage
- Bank-level encryption
- PCI DSS compliant payments (via Razorpay)
- Role-based access control
- Audit trails for all actions

## 📊 Admin Features

- Dashboard with KPIs and analytics
- Visa application management
- Tour inventory management
- User management
- Payment reconciliation
- Support ticket system
- Content management (CMS)
- Bulk operations
- Report generation

## 🔄 Status Tracking

### Visa Application Statuses
- DRAFT → PAYMENT_PENDING → DOCS_PENDING → UNDER_REVIEW → SUBMITTED_TO_EMBASSY → IN_PROGRESS → APPROVED/REJECTED → DISPATCHED

### Tour Booking Statuses
- PENDING → CONFIRMED → VOUCHERS_UPLOADED → COMPLETED/CANCELLED

## 📞 Support & Contact

- Email: support@travunited.com
- Phone: +91 123 456 7890
- WhatsApp Support: Available for premium customers

## 🚧 Development Status

### ✅ Completed
- [x] Project setup and configuration
- [x] Database schema and types
- [x] Public website pages (Home, Visas, Tours, About, Contact, Track)
- [x] Authentication system (Login/Signup with OTP)
- [x] Complete visa booking flow (6 steps)
- [x] User dashboard
- [x] Document upload system

### 🚧 In Progress
- [ ] Tour booking flow completion
- [ ] Admin dashboard
- [ ] Razorpay integration finalization
- [ ] Support ticket system
- [ ] Email/SMS notifications

### 📋 Planned
- [ ] Advanced search and filters
- [ ] Multi-language support
- [ ] Referral program
- [ ] Loyalty points system
- [ ] Travel insurance integration
- [ ] Flight and hotel booking

## 📚 Complete Documentation

### 🎯 Quick Start
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** ⭐ - Master index of all docs

### 💳 Visa Booking Process
Complete visa application workflow planning:

- **[VISA_BOOKING_PROCESS.md](VISA_BOOKING_PROCESS.md)** - Detailed end-to-end process (40+ pages)
- **[VISA_BOOKING_QUICK_REFERENCE.md](VISA_BOOKING_QUICK_REFERENCE.md)** - Quick reference guide
- **[VISA_BOOKING_DIAGRAMS.md](VISA_BOOKING_DIAGRAMS.md)** - Visual flowcharts and diagrams
- **[PROCESS_PLANNING_SUMMARY.md](PROCESS_PLANNING_SUMMARY.md)** - Executive summary

### 👨‍💼 Admin Dashboard Planning
Complete administrative interface documentation:

- **[ADMIN_DASHBOARD_PLAN.md](ADMIN_DASHBOARD_PLAN.md)** - Complete specs (40+ pages)
- **[ADMIN_DASHBOARD_QUICK_REFERENCE.md](ADMIN_DASHBOARD_QUICK_REFERENCE.md)** - Daily ops guide
- **[ADMIN_DASHBOARD_DIAGRAMS.md](ADMIN_DASHBOARD_DIAGRAMS.md)** - Visual workflows
- **[ADMIN_IMPLEMENTATION_ROADMAP.md](ADMIN_IMPLEMENTATION_ROADMAP.md)** - 12-week dev plan
- **[ADMIN_PLANNING_SUMMARY.md](ADMIN_PLANNING_SUMMARY.md)** - Executive summary

### 📊 Project Status
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current status & statistics

## 📝 Environment Setup

### Supabase Setup

1. Create a new Supabase project
2. Set up authentication (Email/Phone providers)
3. Create storage buckets:
   - `documents`: For visa documents
   - `tour-images`: For tour package images
4. Run database migrations (create tables based on schema in `types/database.ts`)

### Razorpay Setup

1. Sign up for Razorpay account
2. Enable required payment methods (UPI, Cards, Net Banking, Wallets)
3. Set up webhooks for payment events
4. Configure test/live mode as needed

## 🤝 Contributing

This is a proprietary project. For access and contribution guidelines, please contact the development team.

## 📄 License

Copyright © 2024 Travunited. All rights reserved.

---

**Built with ❤️ for seamless travel experiences**


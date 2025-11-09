// Database Types for Travunited Platform

export type VisaApplicationStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'DOCS_PENDING'
  | 'UNDER_REVIEW'
  | 'SUBMITTED_TO_EMBASSY'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISPATCHED';

export type TourBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'VOUCHERS_UPLOADED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIAL_REFUND';

export type OrderType = 'VISA' | 'TOUR';

export type DocumentStatus =
  | 'PENDING'
  | 'UPLOADED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REUPLOAD_REQUIRED';

export type UserRole =
  | 'CUSTOMER'
  | 'SUPER_ADMIN'
  | 'OPS_HEAD'
  | 'VISA_OPS'
  | 'TOUR_OPS'
  | 'FINANCE'
  | 'SUPPORT'
  | 'CONTENT_MANAGER';

// User Entity
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Traveller Profile Entity
export interface TravellerProfile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;
  passport_number: string;
  passport_expiry: string;
  passport_issue_date: string;
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  is_minor: boolean;
  is_senior: boolean;
  is_first_time: boolean;
  created_at: string;
  updated_at: string;
}

// Visa Country Entity
export interface VisaCountry {
  id: string;
  name: string;
  code: string;
  flag_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Visa Type Entity
export interface VisaType {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  category: 'TOURIST' | 'BUSINESS' | 'TRANSIT' | 'STUDENT' | 'WORK' | 'OTHER';
  government_fee: number;
  service_fee: number;
  processing_days: number;
  validity_days: number;
  stay_duration_days: number;
  is_e_visa: boolean;
  is_express_available: boolean;
  requires_interview: boolean;
  description: string;
  overview: string;
  eligibility_rules: string;
  important_notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Required Documents for Visa Type
export interface VisaRequiredDocument {
  id: string;
  visa_type_id: string;
  document_name: string;
  document_type: string;
  is_mandatory: boolean;
  description: string;
  sample_url?: string;
  order: number;
}

// Visa Application Header
export interface VisaApplication {
  id: string;
  user_id: string;
  visa_type_id: string;
  application_number: string;
  status: VisaApplicationStatus;
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  processing_type: 'STANDARD' | 'EXPRESS';
  estimated_completion_date: string;
  actual_completion_date?: string;
  admin_notes?: string;
  rejection_reason?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Visa Applicant (per traveller in an application)
export interface VisaApplicant {
  id: string;
  visa_application_id: string;
  traveller_profile_id: string;
  full_name: string;
  date_of_birth: string;
  passport_number: string;
  nationality: string;
  status: VisaApplicationStatus;
  created_at: string;
  updated_at: string;
}

// Visa Document (per applicant/document)
export interface VisaDocument {
  id: string;
  visa_applicant_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number;
  status: DocumentStatus;
  rejection_reason?: string;
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// Tour Entity
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  starting_price: number;
  category: 'DOMESTIC' | 'INTERNATIONAL';
  theme: 'HONEYMOON' | 'FAMILY' | 'ADVENTURE' | 'WEEKEND' | 'LUXURY' | 'BUDGET' | 'OTHER';
  itinerary: any; // JSON
  inclusions: string[];
  exclusions: string[];
  hotel_details: any; // JSON
  images: string[];
  is_visa_included: boolean;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

// Tour Departure (date-wise inventory)
export interface TourDeparture {
  id: string;
  tour_id: string;
  departure_date: string;
  return_date: string;
  available_seats: number;
  total_seats: number;
  price_per_person: number;
  is_available: boolean;
}

// Tour Booking Header
export interface TourBooking {
  id: string;
  user_id: string;
  tour_id: string;
  tour_departure_id: string;
  booking_number: string;
  status: TourBookingStatus;
  total_guests: number;
  room_configuration: any; // JSON
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  payment_type: 'FULL' | 'PARTIAL';
  include_visa: boolean;
  include_insurance: boolean;
  include_airport_transfer: boolean;
  admin_notes?: string;
  cancellation_reason?: string;
  voucher_url?: string;
  created_at: string;
  updated_at: string;
}

// Tour Guest
export interface TourGuest {
  id: string;
  tour_booking_id: string;
  traveller_profile_id?: string;
  full_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  created_at: string;
}

// Order (maps to Razorpay)
export interface Order {
  id: string;
  user_id: string;
  order_type: OrderType;
  reference_id: string; // visa_application_id or tour_booking_id
  order_number: string;
  razorpay_order_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

// Payment
export interface Payment {
  id: string;
  order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  payment_date?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

// Refund
export interface Refund {
  id: string;
  payment_id: string;
  razorpay_refund_id?: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

// Support Ticket
export interface SupportTicket {
  id: string;
  user_id: string;
  reference_type?: 'VISA' | 'TOUR';
  reference_id?: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Support Message
export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'USER' | 'ADMIN';
  message: string;
  attachments?: string[];
  created_at: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

// Role
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Staff User
export interface StaffUser {
  id: string;
  user_id: string;
  role_id: string;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Content Block
export interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content: any; // JSON
  type: 'BANNER' | 'SECTION' | 'FAQ' | 'OTHER';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Blog Post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: string;
  featured_image?: string;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Addon Service
export interface AddonService {
  id: string;
  name: string;
  description: string;
  price: number;
  service_type: 'VISA' | 'TOUR' | 'BOTH';
  is_active: boolean;
}

// Application Timeline
export interface ApplicationTimeline {
  id: string;
  application_id: string;
  application_type: 'VISA' | 'TOUR';
  status: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}


# 📄 Document Management System - Complete Plan

## Enterprise-Grade Document Management for Visa Applications

---

## 🎯 Overview

A comprehensive document management system with upload, validation, tracking, preview, verification workflow, and admin controls.

---

## ✨ CORE FEATURES

### 1. Document Upload
```
✅ Multiple file types (PDF, JPG, PNG, JPEG)
✅ Drag & drop interface
✅ Click to browse
✅ Camera capture (mobile)
✅ Multiple files per requirement
✅ Bulk upload support
✅ File validation (type, size, format)
✅ Real-time progress tracking
✅ Upload retry on failure
✅ Resume interrupted uploads
```

### 2. File Validation
```
✅ File type validation (PDF, JPG, PNG only)
✅ File size limits (max 5MB per file)
✅ Image dimension validation
✅ PDF page count check
✅ File corruption detection
✅ Duplicate file prevention
✅ Passport expiry validation (if passport)
✅ Photo specifications check (if photo)
```

### 3. Upload Progress
```
✅ Individual file progress bars
✅ Overall upload percentage
✅ Upload speed display
✅ Time remaining estimate
✅ Success/failure notifications
✅ Retry failed uploads
✅ Cancel uploads
```

### 4. Document Preview
```
✅ PDF preview (first page)
✅ Image preview (full size)
✅ Zoom in/out functionality
✅ Rotate images
✅ Download original
✅ Lightbox view
✅ Thumbnail generation
```

### 5. Requirements Checklist (Phase 4)
```
✅ Required vs optional documents
✅ Upload status for each (✓/✗/⏳)
✅ Completion percentage
✅ Visual progress indicator
✅ Missing documents highlighted
✅ Click to upload
✅ Sample document links
✅ Requirement descriptions
✅ File specifications
```

### 6. Upload Status Tracking
```
States:
- Not Uploaded (gray)
- Uploading (blue, animated)
- Uploaded (green)
- Pending Verification (yellow)
- Verified (green, checkmark)
- Rejected (red, with reason)
- Reupload Required (orange)
```

### 7. Missing Documents Alerts
```
✅ Banner at top of page
✅ Count of missing documents
✅ List of missing items
✅ "Upload Now" CTAs
✅ Email reminders (automated)
✅ Dashboard notifications
✅ Block application submission if incomplete
```

### 8. Document Operations
```
Download:
- ✅ Download original file
- ✅ Download all as ZIP
- ✅ Download application packet

Delete/Replace:
- ✅ Remove uploaded document
- ✅ Replace with new version
- ✅ Version history tracking
- ✅ Confirmation dialogs

Verification (Admin):
- ✅ Approve document
- ✅ Reject with reason
- ✅ Request replacement
- ✅ Add admin notes
```

---

## 🗄️ DATABASE SCHEMA (Already Created)

### `visa_application_documents`
```sql
- id, application_id, traveler_id
- document_requirement_id
- document_name, document_type
- file_url, file_size, file_mime_type
- upload_status, verification_status
- rejection_reason, admin_notes
- uploaded_at, verified_at, verified_by
```

### Additional Table: `document_versions`
```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES visa_application_documents(id),
  version_number INTEGER,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP,
  replaced_by UUID REFERENCES auth.users(id),
  replacement_reason TEXT
);
```

---

## 🎨 UI COMPONENTS

### User-Facing Components

**1. DocumentUploadZone**
```typescript
Features:
- Drag & drop area
- File browser
- Multiple file selection
- Progress indicators
- Success/error states
- File list with actions

Props:
- documentType: string
- maxFiles: number
- maxSizePerFile: number (MB)
- acceptedFormats: string[]
- onUpload: (files) => Promise<void>
- existingFiles: File[]
```

**2. DocumentRequirementCard**
```typescript
Features:
- Requirement name & description
- Mandatory/optional badge
- Upload status indicator
- Sample document link
- File specifications
- Upload button/zone
- Uploaded files list

Props:
- requirement: DocumentRequirement
- uploadedCount: number
- onUploadClick: () => void
- status: 'pending' | 'uploaded' | 'verified' | 'rejected'
```

**3. DocumentChecklist**
```typescript
Features:
- All requirements listed
- Visual status indicators
- Completion percentage
- Progress bar
- Filter by status
- "Upload All" bulk action
- Missing documents highlighted

Props:
- requirements: DocumentRequirement[]
- uploadedDocuments: UploadedDocument[]
- onDocumentClick: (reqId) => void
```

**4. DocumentPreviewModal**
```typescript
Features:
- Full-screen modal
- PDF viewer (pdf.js)
- Image viewer with zoom
- Navigation (prev/next)
- Download button
- Close button
- Rotate image
- Zoom controls

Props:
- document: UploadedDocument
- onClose: () => void
- onDownload: () => void
- onDelete: () => void
```

**5. UploadProgressBar**
```typescript
Features:
- Animated progress bar
- Percentage display
- File name
- File size
- Upload speed
- Time remaining
- Cancel button

Props:
- fileName: string
- fileSize: number
- progress: number
- onCancel: () => void
```

**6. MissingDocumentsAlert**
```typescript
Features:
- Warning banner
- Count of missing docs
- List of items
- "Upload Now" CTAs
- Dismissible
- Sticky on scroll

Props:
- missingDocuments: DocumentRequirement[]
- onUploadClick: (reqId) => void
- onDismiss: () => void
```

---

### Admin-Facing Components

**1. DocumentVerificationPanel**
```typescript
Features:
- Document preview
- Approve/reject buttons
- Reason for rejection input
- Admin notes field
- Request reupload
- Download original
- View history

Props:
- document: UploadedDocument
- onApprove: () => Promise<void>
- onReject: (reason: string) => Promise<void>
- onRequestReupload: () => Promise<void>
```

**2. DocumentBatchActions**
```typescript
Features:
- Select all/none
- Bulk approve
- Bulk reject
- Download selected
- Assign to reviewer

Props:
- selectedDocuments: string[]
- onBulkApprove: () => Promise<void>
- onBulkReject: () => Promise<void>
```

**3. DocumentQueueView**
```typescript
Features:
- Pending documents list
- Filter by status
- Sort by upload date
- Search by application
- Priority flags
- Quick actions

Props:
- documents: UploadedDocument[]
- onSelectDocument: (docId) => void
```

---

## 🔄 DOCUMENT UPLOAD FLOW

### User Journey

**Step 1: View Requirements**
```
User sees checklist:
- Passport Copy ✗ (required)
- Photograph ✗ (required)
- Flight Booking ✗ (required)
- Hotel Booking ✗ (optional)
- Bank Statements ✗ (optional)

Each shows:
- Status icon
- Document name
- Description
- Sample link
- Upload button
```

**Step 2: Click Upload**
```
Modal/inline zone opens:
- Drag & drop area
- File browser button
- Camera capture (mobile)
- Requirements reminder
- File specs display
```

**Step 3: Select Files**
```
User selects files:
- Validation runs immediately
- Invalid files rejected with reason
- Valid files queued
- Preview thumbnails shown
```

**Step 4: Upload**
```
For each file:
- Upload to Supabase Storage
- Progress bar shows percentage
- Success: Add to database
- Failure: Show error, retry option
```

**Step 5: Confirmation**
```
After upload:
- Green checkmark on requirement
- File listed under requirement
- Preview thumbnail shown
- Download/delete options
- Status: "Pending Verification"
```

---

## 🔒 ADMIN VERIFICATION WORKFLOW

### Admin Journey

**Step 1: Queue View**
```
Admin sees pending documents:
- Application number
- Document type
- Uploaded date
- Traveler name
- Priority flag
- Quick preview
```

**Step 2: Review Document**
```
Admin clicks to review:
- Full document preview
- Application context
- Traveler details
- Requirements spec
- Previous versions (if any)
```

**Step 3: Decision**
```
Admin can:

A) Approve:
   - Click "Approve" button
   - Document marked verified
   - Status: "Verified" ✅
   - User notified
   - Move to next document

B) Reject:
   - Click "Reject" button
   - Enter rejection reason
   - Document marked rejected
   - Status: "Rejected" ✗
   - User notified with reason
   - User can reupload

C) Request More Info:
   - Add admin notes
   - Request specific changes
   - Status: "Action Required" ⚠️
   - User notified
```

**Step 4: Batch Processing**
```
For multiple documents:
- Select checkboxes
- Bulk approve (if all good)
- Bulk actions
- Efficiency tools
```

---

## 📊 API ENDPOINTS

### Upload & Management
```
POST   /api/documents/upload         - Upload single document
POST   /api/documents/upload/bulk    - Upload multiple documents
GET    /api/documents/[id]            - Get document details
DELETE /api/documents/[id]            - Delete document
POST   /api/documents/[id]/replace   - Replace with new version
GET    /api/documents/[id]/download  - Download document
```

### Verification (Admin)
```
POST   /api/documents/[id]/verify    - Approve document
POST   /api/documents/[id]/reject    - Reject document
POST   /api/documents/[id]/request-reupload - Request new upload
GET    /api/documents/pending         - Get pending documents
POST   /api/documents/bulk-verify    - Bulk approve
```

### Status & Tracking
```
GET    /api/documents/status/[appId] - Get all document statuses
GET    /api/documents/missing/[appId] - Get missing documents
GET    /api/documents/checklist/[appId] - Get requirement checklist
```

---

## 🎯 SMART FEATURES

### Auto-Validation
```javascript
const validateDocument = (file, requirement) => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }
  
  // Check if passport
  if (requirement.type === 'passport') {
    // Validate passport expiry if data available
    // Check image quality
    // Verify readability
  }
  
  // Check if photo
  if (requirement.type === 'photo') {
    // Validate dimensions
    // Check background color
    // Verify face detection
  }
  
  return { valid: true };
};
```

### Smart Upload Queue
```javascript
const uploadQueue = {
  pending: [],
  uploading: [],
  completed: [],
  failed: [],
  
  add(files) {
    // Add to pending
    // Start upload worker
  },
  
  process() {
    // Upload 3 files concurrently
    // Update progress
    // Handle errors
    // Notify on completion
  }
};
```

### Notification System
```javascript
const notifyUser = (event) => {
  switch(event.type) {
    case 'document_uploaded':
      email.send('Document received');
      break;
    case 'document_verified':
      email.send('Document approved');
      dashboard.notify('✅ Document verified');
      break;
    case 'document_rejected':
      email.send('Document rejected', { reason });
      dashboard.notify('⚠️ Document needs attention');
      break;
    case 'documents_complete':
      email.send('All documents verified!');
      dashboard.notify('🎉 Ready for submission');
      break;
  }
};
```

---

## 🎨 UI MOCKUPS

### User View - Upload Step
```
┌─────────────────────────────────────────────────────┐
│  Document Upload - Step 3 of 9                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ⚠️  3 documents still required                     │
│     Please upload to continue                       │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  Document Checklist            Progress: 60%       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━                          │
│  [██████████░░░░░] 60%                             │
│                                                     │
│  Required Documents:                               │
│                                                     │
│  ✅ Passport Copy            [View] [Delete]       │
│     └─ passport.pdf (2.1 MB) - Verified            │
│                                                     │
│  ✅ Photograph               [View] [Delete]       │
│     └─ photo.jpg (512 KB) - Pending Review         │
│                                                     │
│  ✗  Flight Booking           [Upload Now]          │
│     └─ Required - PDF, JPG, PNG (max 5MB)          │
│                                                     │
│  ✗  Hotel Booking            [Upload Now]          │
│     └─ Required - PDF, JPG, PNG (max 5MB)          │
│                                                     │
│  ✗  Bank Statements          [Upload Now]          │
│     └─ Required - Last 3 months (max 5MB each)     │
│                                                     │
│  Optional Documents:                               │
│                                                     │
│  ○  Travel Insurance         [Upload]              │
│     └─ Optional                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Admin View - Verification Panel
```
┌─────────────────────────────────────────────────────┐
│  Document Verification - Application TVU-20250109   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Queue: 12 pending                                 │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  [Preview]                                    │ │
│  │                                               │ │
│  │  [Passport Image Preview]                     │ │
│  │                                               │ │
│  │  Zoom: [+] [-] | Rotate: [↻]                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Document: Passport Copy                           │
│  Traveler: John Doe                                │
│  Uploaded: 9 Jan 2025, 10:30 AM                    │
│  Size: 2.1 MB                                      │
│                                                     │
│  Requirement Specifications:                       │
│  • Bio page clearly visible ✅                     │
│  • Valid for 6+ months ✅                          │
│  • All corners visible ✅                          │
│                                                     │
│  Admin Notes:                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ [Text area for notes]                         │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Actions:                                          │
│  [✓ Approve] [✗ Reject] [↻ Request Reupload]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 COMPLETE WORKFLOWS

### Upload Workflow
```
1. User clicks "Upload" on requirement
2. File picker/drag zone opens
3. User selects file(s)
4. Client-side validation runs
5. Invalid files rejected immediately
6. Valid files added to upload queue
7. Upload starts (with progress)
8. File uploaded to Supabase Storage
9. Database record created
10. Timeline event added
11. User sees success message
12. Checklist updates with ✅
13. Admin notified (queue updated)
```

### Verification Workflow
```
1. Admin sees pending document in queue
2. Clicks to review
3. Document preview loads
4. Admin reviews against requirements
5. Admin makes decision:
   
   If Approved:
   - Clicks "Approve"
   - Status → "Verified"
   - User notified via email
   - Timeline updated
   - Next document in queue
   
   If Rejected:
   - Clicks "Reject"
   - Enters reason
   - Status → "Rejected"
   - User notified with reason
   - User can reupload
   - Timeline updated
```

### Reupload Workflow
```
1. User receives rejection notification
2. Views document in dashboard
3. Sees rejection reason
4. Clicks "Upload New Version"
5. Previous version archived
6. New upload process starts
7. New file uploaded
8. Version number increments
9. Admin re-reviews
10. Timeline shows reupload event
```

---

## 📱 MOBILE FEATURES

### Camera Integration
```javascript
const CameraCapture = () => {
  const captureDocument = async () => {
    // Access device camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    // Show camera preview
    // Capture photo
    // Auto-crop document edges
    // Enhance clarity
    // Upload
  };
  
  return (
    <button onClick={captureDocument}>
      📷 Take Photo
    </button>
  );
};
```

### Mobile Upload UX
```
✅ Large touch targets
✅ Swipeable document list
✅ Quick camera access
✅ Image editor (crop, rotate)
✅ Offline queue (upload when online)
✅ Simplified interface
✅ Thumb-friendly actions
```

---

## 🔐 SECURITY

### Upload Security
```
✅ Authenticated users only
✅ User can only upload to own applications
✅ File type whitelist
✅ File size limits enforced
✅ Virus scanning (via Supabase/3rd party)
✅ Storage bucket permissions (RLS)
✅ Signed URLs for downloads
✅ Auto-expire download links
```

### Privacy
```
✅ Private storage bucket for documents
✅ RLS policies (users see only own docs)
✅ Admins with proper permissions only
✅ Audit log for all document access
✅ GDPR-compliant (deletion on request)
✅ Encryption at rest (Supabase default)
✅ Encrypted in transit (HTTPS)
```

---

## ✅ SUCCESS METRICS

### User Experience
- Upload success rate > 99%
- Average upload time < 10 seconds
- First-time success rate > 95%
- User satisfaction > 4.5/5

### Admin Efficiency
- Verification time < 2 minutes per document
- Queue processing speed
- Rejection rate < 5%
- Reupload rate < 3%

### Technical
- Upload reliability > 99.9%
- Storage costs optimized
- Fast retrieval times
- Zero data loss

---

**Ready to build the most comprehensive document management system!** 📄



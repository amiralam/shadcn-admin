# Invoice Analysis Dashboard

A comprehensive invoice analysis dashboard built with React, TypeScript, and the shadcn-admin template. This feature enables users to upload carrier invoices (CSV/XLSX), automatically detect carrier information, process invoices, and view detailed analysis results.

## 🌟 Features

- **Drag & Drop Upload**: Easy file upload with validation (CSV, XLS, XLSX)
- **Automatic Carrier Detection**: AI-powered detection with confidence scoring
- **Confirmation Dialog**: Review and override detected information
- **Real-time Processing**: Live progress tracking with polling
- **Comprehensive Results**: Detailed tables with export capabilities
- **Error Handling**: Robust error management with retry options
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
src/features/invoices/
├── index.tsx                              # Main page component with flow orchestration
├── api/
│   └── invoices.ts                        # API service layer
├── components/
│   ├── invoice-upload.tsx                 # Drag & drop upload component
│   ├── invoice-confirmation-dialog.tsx    # Carrier confirmation dialog
│   ├── invoice-processing-status.tsx      # Real-time processing status
│   └── invoice-results.tsx                # Results display with tables
└── data/
    └── schema.ts                          # TypeScript schemas and types

src/routes/_authenticated/invoices/
└── index.tsx                              # Route definition
```

## 🔄 User Flow

```
1. Upload Document (CSV/XLSX)
   ↓
2. Review Detection Results
   - Detected carrier (with confidence %)
   - Invoice number
   - Invoice date
   - Records detected
   ↓
3. Confirm or Override
   - User can modify detected values
   - Add optional due date
   ↓
4. Processing
   - Real-time progress tracking (0-100%)
   - Stage-by-stage updates
   - Poll every 3 seconds
   ↓
5. View Results
   - Summary cards (total records, freight, fuel, etc.)
   - Extracted shipments table (paginated)
   - Accessorial costs table
   - Export to CSV
```

## 🔌 API Integration

### Base URL Configuration

Set the API base URL in your environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

If not set, defaults to `/api/v1` (relative path).

### API Endpoints

#### 1. Upload Document
```typescript
POST /api/v1/documents/upload
Content-Type: multipart/form-data

Response: {
  success: true,
  data: {
    job_id: "abc-123-xyz",
    detection: {
      carrier: "dhl",
      confidence: 0.95,
      invoice_number: "INV-001",
      invoice_date: "2025-10-29",
      records_detected: 100
    }
  }
}
```

#### 2. Confirm Job
```typescript
POST /api/v1/jobs/{job_id}/confirm
Content-Type: application/json

Request: {
  carrier: "dhl",
  invoice_date: "2025-10-29",
  invoice_number: "INV-001",
  due_date: "2025-11-28"  // optional
}

Response: {
  success: true,
  data: {
    job_id: "abc-123-xyz",
    status: "QUEUED"
  }
}
```

#### 3. Check Job Status (Polling)
```typescript
GET /api/v1/jobs/{job_id}/status

Response: {
  success: true,
  data: {
    job_id: "abc-123-xyz",
    status: "PROCESSING",  // QUEUED | PROCESSING | COMPLETED | FAILED | RECOVERING
    progress: {
      percentage: 50,
      message: "Executing field extraction"
    }
  }
}
```

#### 4. Get Results
```typescript
GET /api/v1/jobs/{job_id}/results

Response: {
  success: true,
  data: {
    job_id: "abc-123-xyz",
    results: {
      extracted_fields: [...],
      accessorial_costs: [...],
      summary: {
        total_records: 100,
        total_freight: 12000.00,
        total_fuel: 3000.00,
        total_accessorial: 500.00,
        total_amount: 15500.00
      }
    }
  }
}
```

## 🎨 Components

### InvoiceUpload
Drag-and-drop file upload component with validation.

**Features:**
- File type validation (CSV, XLS, XLSX)
- File size validation (max 50MB)
- Visual drag feedback
- File preview before upload

### InvoiceConfirmationDialog
Modal dialog for reviewing and confirming detected information.

**Features:**
- Display detection confidence
- Carrier selection dropdown
- Invoice number/date editing
- Optional due date

### InvoiceProcessingStatus
Real-time processing status display.

**Features:**
- Progress bar (0-100%)
- Current stage message
- Stage history log
- Cancel processing option

### InvoiceResults
Comprehensive results display with tables.

**Features:**
- Summary cards with key metrics
- Tabbed interface (Shipments / Accessorial Costs)
- Sortable, paginated tables
- CSV export functionality
- Currency formatting

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 🔐 Authentication

The API client uses Axios with automatic authentication header injection. Configure your authentication token in the axios interceptors or use the existing auth store:

```typescript
import axios from 'axios'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📊 Data Models

### Job Status
```typescript
type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "RECOVERING"
```

### Extracted Field
```typescript
interface ExtractedField {
  tracking_number: string
  invoice_number: string
  total_billed: number
  freight_cost: number
  fuel_cost: number
  weight: number
  origin_country?: string
  dest_country?: string
  // ... additional fields
}
```

### Accessorial Charge
```typescript
interface AccessorialCharge {
  master_tracking_code: string
  charge_category: string
  charge_name: string
  charge_amount: number
}
```

## 🎯 Key Features Implemented

✅ Drag-and-drop file upload
✅ File type validation (CSV, XLSX, XLS)
✅ Carrier confirmation modal
✅ Real-time status polling (3-second interval)
✅ Progress bar with percentage
✅ Results display with tables
✅ Export to CSV functionality
✅ Error handling and retry logic
✅ Loading states and spinners
✅ Mobile responsive design
✅ TypeScript schemas with Zod validation
✅ React Query for data fetching
✅ Sidebar navigation integration

## 🔧 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching & caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 📝 Notes

- The polling interval is set to 3 seconds for status updates
- Maximum file size is 50MB
- Supported file types: CSV, XLS, XLSX
- Results are paginated (10 items per page)
- Currency is formatted as USD

## 🐛 Troubleshooting

### Build Errors
If you encounter build errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Route Not Found
If the invoice route is not working, restart the dev server to regenerate route types:
```bash
npm run dev
```

### API Connection Issues
Check your `.env` file and ensure `VITE_API_BASE_URL` is set correctly.

## 🤝 Contributing

To extend this feature:

1. Add new fields to `schema.ts`
2. Update API service methods in `api/invoices.ts`
3. Modify components to display new data
4. Update TypeScript types accordingly

## 📄 License

This project follows the same license as the shadcn-admin template.

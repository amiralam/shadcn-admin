import { z } from 'zod'

// Job Status Enum
export const jobStatusEnum = z.enum([
  'QUEUED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'RECOVERING',
])
export type JobStatus = z.infer<typeof jobStatusEnum>

// Carrier Detection Schema
export const carrierDetectionSchema = z.object({
  carrier: z.string(),
  confidence: z.number(),
  invoice_number: z.string(),
  invoice_date: z.string(),
  records_detected: z.number(),
})
export type CarrierDetection = z.infer<typeof carrierDetectionSchema>

// Upload Response Schema
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    job_id: z.string(),
    detection: carrierDetectionSchema,
  }),
})
export type UploadResponse = z.infer<typeof uploadResponseSchema>

// Progress Schema
export const progressSchema = z.object({
  percentage: z.number().min(0).max(100),
  message: z.string(),
})
export type Progress = z.infer<typeof progressSchema>

// Status Response Schema
export const statusResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    job_id: z.string(),
    status: jobStatusEnum,
    progress: progressSchema,
  }),
})
export type StatusResponse = z.infer<typeof statusResponseSchema>

// Extracted Field Schema
export const extractedFieldSchema = z.object({
  tracking_number: z.string(),
  invoice_number: z.string(),
  total_billed: z.number(),
  freight_cost: z.number(),
  fuel_cost: z.number(),
  weight: z.number(),
  origin_country: z.string().optional(),
  dest_country: z.string().optional(),
  service_type: z.string().optional(),
  delivery_date: z.string().optional(),
  ship_date: z.string().optional(),
  zone: z.string().optional(),
  dimensions: z.string().optional(),
  reference_number: z.string().optional(),
  shipper_name: z.string().optional(),
  consignee_name: z.string().optional(),
  // Additional fields can be added as needed
})
export type ExtractedField = z.infer<typeof extractedFieldSchema>

// Accessorial Charge Schema
export const accessorialChargeSchema = z.object({
  master_tracking_code: z.string(),
  charge_category: z.string(),
  charge_name: z.string(),
  charge_amount: z.number(),
})
export type AccessorialCharge = z.infer<typeof accessorialChargeSchema>

// Summary Schema
export const summarySchema = z.object({
  total_records: z.number(),
  total_freight: z.number(),
  total_fuel: z.number(),
  total_accessorial: z.number(),
  total_amount: z.number(),
})
export type Summary = z.infer<typeof summarySchema>

// Results Response Schema
export const resultsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    job_id: z.string(),
    results: z.object({
      extracted_fields: z.array(extractedFieldSchema),
      accessorial_costs: z.array(accessorialChargeSchema),
      summary: summarySchema,
    }),
  }),
})
export type ResultsResponse = z.infer<typeof resultsResponseSchema>

// Confirm Job Request Schema
export const confirmJobRequestSchema = z.object({
  carrier: z.string(),
  invoice_date: z.string(),
  invoice_number: z.string(),
  due_date: z.string().optional(),
})
export type ConfirmJobRequest = z.infer<typeof confirmJobRequestSchema>

// Confirm Job Response Schema
export const confirmJobResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    job_id: z.string(),
    status: jobStatusEnum,
  }),
})
export type ConfirmJobResponse = z.infer<typeof confirmJobResponseSchema>

// Health Response Schema
export const healthResponseSchema = z.object({
  status: z.string(),
})
export type HealthResponse = z.infer<typeof healthResponseSchema>

// Error Response Schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
})
export type ErrorResponse = z.infer<typeof errorResponseSchema>

// Supported carriers
export const supportedCarriers = [
  { value: 'dhl', label: 'DHL' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'usps', label: 'USPS' },
  { value: 'other', label: 'Other' },
] as const

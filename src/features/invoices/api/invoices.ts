import axios from 'axios'
import type {
  UploadResponse,
  StatusResponse,
  ResultsResponse,
  ConfirmJobRequest,
  ConfirmJobResponse,
  HealthResponse,
} from '../data/schema'

// Base URL for the API - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * Upload a document (CSV/XLSX) for processing
 * @param file - The file to upload
 * @returns Upload response with job_id and carrier detection
 */
export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await axios.post<UploadResponse>(
    `${API_BASE_URL}/documents/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return data
}

/**
 * Confirm a job with carrier and metadata
 * @param jobId - The job ID from upload response
 * @param request - Confirmation request with carrier, invoice date, etc.
 * @returns Confirmation response with job status
 */
export const confirmJob = async (
  jobId: string,
  request: ConfirmJobRequest
): Promise<ConfirmJobResponse> => {
  const { data } = await axios.post<ConfirmJobResponse>(
    `${API_BASE_URL}/jobs/${jobId}/confirm`,
    request
  )

  return data
}

/**
 * Check the status of a job (for polling)
 * @param jobId - The job ID to check
 * @returns Status response with current status and progress
 */
export const getJobStatus = async (jobId: string): Promise<StatusResponse> => {
  const { data } = await axios.get<StatusResponse>(
    `${API_BASE_URL}/jobs/${jobId}/status`
  )

  return data
}

/**
 * Get the processing results for a completed job
 * @param jobId - The job ID to get results for
 * @returns Results response with extracted fields and summary
 */
export const getJobResults = async (jobId: string): Promise<ResultsResponse> => {
  const { data } = await axios.get<ResultsResponse>(
    `${API_BASE_URL}/jobs/${jobId}/results`
  )

  return data
}

/**
 * Check if the service is healthy
 * @returns Health status
 */
export const getHealthStatus = async (): Promise<HealthResponse> => {
  const { data } = await axios.get<HealthResponse>('/health')
  return data
}

/**
 * Cancel a job (optional - if backend supports it)
 * @param jobId - The job ID to cancel
 */
export const cancelJob = async (jobId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/jobs/${jobId}/cancel`)
}

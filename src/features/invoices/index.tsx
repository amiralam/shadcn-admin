import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FileText, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { InvoiceUpload } from './components/invoice-upload'
import { InvoiceConfirmationDialog } from './components/invoice-confirmation-dialog'
import { InvoiceProcessingStatus } from './components/invoice-processing-status'
import { InvoiceResults } from './components/invoice-results'
import {
  uploadDocument,
  confirmJob,
  getJobStatus,
  getJobResults,
  cancelJob,
} from './api/invoices'
import type {
  CarrierDetection,
  ConfirmJobRequest,
  ResultsResponse,
  StatusResponse,
} from './data/schema'

type FlowStep = 'upload' | 'confirm' | 'processing' | 'results' | 'error'

export function InvoiceAnalysis() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload')
  const [jobId, setJobId] = useState<string | null>(null)
  const [detection, setDetection] = useState<CarrierDetection | null>(null)
  const [results, setResults] = useState<ResultsResponse['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusData, setStatusData] = useState<StatusResponse['data'] | null>(null)

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      if (data.success) {
        setJobId(data.data.job_id)
        setDetection(data.data.detection)
        setCurrentStep('confirm')
        toast.success('Document uploaded successfully!')
      }
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Upload failed'
      setError(errorMessage)
      setCurrentStep('error')
      toast.error(errorMessage)
    },
  })

  // Confirm mutation
  const confirmMutation = useMutation({
    mutationFn: (data: { jobId: string; request: ConfirmJobRequest }) =>
      confirmJob(data.jobId, data.request),
    onSuccess: (data) => {
      if (data.success) {
        setCurrentStep('processing')
        toast.success('Processing started!')
      }
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Confirmation failed'
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  // Status polling query (only runs when in processing step)
  const { data: statusResponse } = useQuery({
    queryKey: ['jobStatus', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: currentStep === 'processing' && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.data.status
      // Poll every 3 seconds if processing or queued, stop otherwise
      return status === 'PROCESSING' || status === 'QUEUED' ? 3000 : false
    },
  })

  // Results query (only runs when job is completed)
  const { data: resultsResponse } = useQuery({
    queryKey: ['jobResults', jobId],
    queryFn: () => getJobResults(jobId!),
    enabled: statusData?.status === 'COMPLETED' && !!jobId,
  })

  // Update status data and handle status changes
  useEffect(() => {
    if (statusResponse?.success) {
      setStatusData(statusResponse.data)

      if (statusResponse.data.status === 'COMPLETED') {
        // Results query will be triggered automatically
        if (resultsResponse?.success) {
          setResults(resultsResponse.data)
          setCurrentStep('results')
          toast.success('Processing completed!')
        }
      } else if (statusResponse.data.status === 'FAILED') {
        setError('Processing failed. Please try again.')
        setCurrentStep('error')
        toast.error('Processing failed')
      }
    }
  }, [statusResponse, resultsResponse])

  // Handlers
  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file)
  }

  const handleConfirm = (data: ConfirmJobRequest) => {
    if (jobId) {
      confirmMutation.mutate({ jobId, request: data })
    }
  }

  const handleCancel = async () => {
    if (jobId) {
      try {
        await cancelJob(jobId)
        toast.info('Processing cancelled')
        handleReset()
      } catch (err) {
        toast.error('Failed to cancel processing')
      }
    }
  }

  const handleReset = () => {
    setCurrentStep('upload')
    setJobId(null)
    setDetection(null)
    setResults(null)
    setError(null)
    setStatusData(null)
  }

  const handleRetry = () => {
    setError(null)
    setCurrentStep('upload')
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <FileText className='size-6' />
          <h1 className='text-3xl font-bold tracking-tight'>Invoice Analysis</h1>
        </div>
        <p className='text-muted-foreground'>
          Upload carrier invoices for automated extraction and analysis
        </p>
      </div>

      {/* Flow Steps */}
      {currentStep === 'upload' && (
        <InvoiceUpload
          onFileSelect={handleFileSelect}
          isLoading={uploadMutation.isPending}
          error={uploadMutation.isError ? error : null}
        />
      )}

      {currentStep === 'confirm' && (
        <InvoiceConfirmationDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) handleReset()
          }}
          detection={detection}
          onConfirm={handleConfirm}
          isLoading={confirmMutation.isPending}
        />
      )}

      {currentStep === 'processing' && statusData && jobId && (
        <div className='mx-auto max-w-2xl'>
          <InvoiceProcessingStatus
            jobId={jobId}
            status={statusData.status}
            progress={statusData.progress}
            onCancel={handleCancel}
          />
        </div>
      )}

      {currentStep === 'results' && results && (
        <InvoiceResults results={results} onBack={handleReset} />
      )}

      {currentStep === 'error' && (
        <div className='mx-auto max-w-2xl space-y-4'>
          <Alert variant='destructive'>
            <AlertCircle className='size-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'An unexpected error occurred'}</AlertDescription>
          </Alert>
          <div className='flex gap-2'>
            <Button onClick={handleRetry} variant='default'>
              Try Again
            </Button>
            <Button onClick={handleReset} variant='outline'>
              Start Over
            </Button>
          </div>
        </div>
      )}

      {/* Upload view is shown, but we also keep the upload component visible for other steps */}
      {currentStep !== 'upload' && currentStep !== 'results' && (
        <div className='flex justify-center pt-4'>
          <Button variant='ghost' onClick={handleReset} size='sm'>
            Cancel and Start Over
          </Button>
        </div>
      )}
    </div>
  )
}

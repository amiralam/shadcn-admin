import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { JobStatus, Progress as ProgressType } from '../data/schema'

interface InvoiceProcessingStatusProps {
  jobId: string
  status: JobStatus
  progress: ProgressType
  onCancel?: () => void
  estimatedTimeRemaining?: number // in seconds
}

export function InvoiceProcessingStatus({
  jobId,
  status,
  progress,
  onCancel,
  estimatedTimeRemaining,
}: InvoiceProcessingStatusProps) {
  const [stages, setStages] = useState<string[]>([])

  useEffect(() => {
    if (progress.message && !stages.includes(progress.message)) {
      setStages((prev) => [...prev, progress.message])
    }
  }, [progress.message, stages])

  const getStatusIcon = () => {
    switch (status) {
      case 'QUEUED':
        return <Clock className='size-8 text-muted-foreground' />
      case 'PROCESSING':
        return <Loader2 className='size-8 animate-spin text-primary' />
      case 'COMPLETED':
        return <CheckCircle2 className='size-8 text-green-500' />
      case 'FAILED':
        return <XCircle className='size-8 text-destructive' />
      case 'RECOVERING':
        return <AlertTriangle className='size-8 text-yellow-500' />
      default:
        return null
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'QUEUED':
        return <Badge variant='secondary'>Queued</Badge>
      case 'PROCESSING':
        return <Badge variant='default'>Processing</Badge>
      case 'COMPLETED':
        return <Badge className='bg-green-500'>Completed</Badge>
      case 'FAILED':
        return <Badge variant='destructive'>Failed</Badge>
      case 'RECOVERING':
        return <Badge className='bg-yellow-500'>Recovering</Badge>
      default:
        return null
    }
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Processing Invoice</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Status Icon and Message */}
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='rounded-full bg-muted p-4'>
            {getStatusIcon()}
          </div>
          <div className='space-y-1'>
            <p className='text-lg font-medium'>{progress.message}</p>
            {estimatedTimeRemaining && status === 'PROCESSING' && (
              <p className='text-sm text-muted-foreground'>
                Estimated time remaining: {formatTime(estimatedTimeRemaining)}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'PROCESSING' || status === 'QUEUED' ? (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Progress</span>
              <span className='font-medium'>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className='h-2' />
          </div>
        ) : null}

        {/* Job ID */}
        <div className='rounded-lg border bg-muted/50 p-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Job ID</span>
            <code className='rounded bg-background px-2 py-1 text-xs'>{jobId}</code>
          </div>
        </div>

        {/* Stage History */}
        {stages.length > 0 && (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Processing Stages</h4>
            <div className='space-y-1 rounded-lg border bg-muted/50 p-3'>
              {stages.map((stage, index) => (
                <div key={index} className='flex items-center gap-2 text-sm'>
                  <CheckCircle2 className='size-4 text-green-500' />
                  <span className='text-muted-foreground'>{stage}</span>
                </div>
              ))}
              {status === 'PROCESSING' && progress.message !== stages[stages.length - 1] && (
                <div className='flex items-center gap-2 text-sm'>
                  <Loader2 className='size-4 animate-spin text-primary' />
                  <span className='font-medium'>{progress.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {(status === 'QUEUED' || status === 'PROCESSING') && onCancel && (
          <Button
            variant='outline'
            onClick={onCancel}
            className='w-full'
          >
            Cancel Processing
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

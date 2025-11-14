import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CarrierDetection } from '../data/schema'
import { supportedCarriers, confirmJobRequestSchema } from '../data/schema'

interface InvoiceConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detection: CarrierDetection | null
  onConfirm: (data: z.infer<typeof confirmJobRequestSchema>) => void
  isLoading?: boolean
}

export function InvoiceConfirmationDialog({
  open,
  onOpenChange,
  detection,
  onConfirm,
  isLoading = false,
}: InvoiceConfirmationDialogProps) {
  const form = useForm<z.infer<typeof confirmJobRequestSchema>>({
    resolver: zodResolver(confirmJobRequestSchema),
    defaultValues: {
      carrier: detection?.carrier || '',
      invoice_number: detection?.invoice_number || '',
      invoice_date: detection?.invoice_date || '',
      due_date: '',
    },
  })

  const handleSubmit = (data: z.infer<typeof confirmJobRequestSchema>) => {
    onConfirm(data)
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  if (!detection) return null

  const confidencePercent = Math.round(detection.confidence * 100)
  const isHighConfidence = detection.confidence >= 0.8

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Confirm Carrier & Invoice Details</DialogTitle>
          <DialogDescription>
            Review the detected information and make any necessary changes before processing.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Detection Summary */}
          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Detection Confidence</span>
                <Badge
                  variant={isHighConfidence ? 'default' : 'secondary'}
                  className='gap-1'
                >
                  {isHighConfidence ? (
                    <CheckCircle2 className='size-3' />
                  ) : (
                    <AlertCircle className='size-3' />
                  )}
                  {confidencePercent}%
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Records Detected</span>
                <span className='text-sm text-muted-foreground'>
                  {detection.records_detected}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='carrier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Carrier <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select carrier' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedCarriers.map((carrier) => (
                          <SelectItem key={carrier.value} value={carrier.value}>
                            {carrier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='invoice_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Invoice Number <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter invoice number' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='invoice_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Invoice Date <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type='date' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='due_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type='date' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='gap-2 sm:gap-0'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Confirming...' : 'Confirm & Process'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

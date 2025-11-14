import { createFileRoute } from '@tanstack/react-router'
import { InvoiceAnalysis } from '@/features/invoices'

export const Route = createFileRoute('/_authenticated/invoices/')({
  component: InvoiceAnalysis,
})

import { createFileRoute } from '@tanstack/react-router'
import { InvoiceDashboard } from '@/features/dashboard/invoice-dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: InvoiceDashboard,
})

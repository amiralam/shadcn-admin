import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  FileText,
  Download,
  Eye,
  Search,
  Upload,
  Calendar,
  DollarSign,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'

// Mock data - replace with real API data
const mockInvoices = [
  {
    id: '1',
    jobId: 'job-001',
    invoiceNumber: 'INV-2024-001',
    carrier: 'DHL',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    totalAmount: 12500.0,
    recordsCount: 145,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    jobId: 'job-002',
    invoiceNumber: 'INV-2024-002',
    carrier: 'FedEx',
    date: '2024-01-14',
    dueDate: '2024-02-14',
    totalAmount: 8750.0,
    recordsCount: 98,
    status: 'processing',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    jobId: 'job-003',
    invoiceNumber: 'INV-2024-003',
    carrier: 'UPS',
    date: '2024-01-13',
    dueDate: '2024-02-13',
    totalAmount: 15200.0,
    recordsCount: 187,
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    jobId: 'job-004',
    invoiceNumber: 'INV-2024-004',
    carrier: 'USPS',
    date: '2024-01-12',
    dueDate: '2024-02-12',
    totalAmount: 6200.0,
    recordsCount: 76,
    status: 'completed',
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    jobId: 'job-005',
    invoiceNumber: 'INV-2024-005',
    carrier: 'DHL',
    date: '2024-01-11',
    dueDate: '2024-02-11',
    totalAmount: 9800.0,
    recordsCount: 112,
    status: 'failed',
    createdAt: '2024-01-11T11:30:00Z',
  },
]

export function InvoicesList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
    }
    return (
      <Badge variant={variants[status] || 'secondary'} className='capitalize'>
        {status}
      </Badge>
    )
  }

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.carrier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCarrier = carrierFilter === 'all' || invoice.carrier === carrierFilter
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesCarrier && matchesStatus
  })

  return (
    <Main className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Invoices</h1>
          <p className='text-muted-foreground'>Manage and analyze your carrier invoices</p>
        </div>
        <Link to='/invoices/analyze'>
          <Button>
            <Upload className='mr-2 size-4' />
            Analyze New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by invoice number or carrier...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue placeholder='All Carriers' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Carriers</SelectItem>
                <SelectItem value='DHL'>DHL</SelectItem>
                <SelectItem value='FedEx'>FedEx</SelectItem>
                <SelectItem value='UPS'>UPS</SelectItem>
                <SelectItem value='USPS'>USPS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue placeholder='All Statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead className='text-right'>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className='font-medium'>
                        <Link
                          to='/invoices/$invoiceId'
                          params={{ invoiceId: invoice.id }}
                          className='hover:underline'
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='rounded-full bg-primary/10 p-1.5'>
                            <FileText className='size-3 text-primary' />
                          </div>
                          {invoice.carrier}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Calendar className='size-3 text-muted-foreground' />
                          {formatDate(invoice.date)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <DollarSign className='size-3 text-muted-foreground' />
                          {formatCurrency(invoice.totalAmount)}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>{invoice.recordsCount}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link to='/invoices/$invoiceId' params={{ invoiceId: invoice.id }}>
                            <Button variant='ghost' size='icon' title='View details'>
                              <Eye className='size-4' />
                            </Button>
                          </Link>
                          <Button variant='ghost' size='icon' title='Download'>
                            <Download className='size-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center text-muted-foreground'>
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Main>
  )
}

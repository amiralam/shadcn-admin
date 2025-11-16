import {
  FileText,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Package,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'

export function InvoiceDashboard() {
  // Mock data - replace with real data from API
  const stats = {
    totalInvoices: 24,
    totalSpend: 156750.0,
    savingsIdentified: 8420.0,
    pendingReview: 3,
  }

  const recentInvoices = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      carrier: 'DHL',
      date: '2024-01-15',
      amount: 12500.0,
      status: 'processed',
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      carrier: 'FedEx',
      date: '2024-01-14',
      amount: 8750.0,
      status: 'review',
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      carrier: 'UPS',
      date: '2024-01-13',
      amount: 15200.0,
      status: 'processed',
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of your carrier invoice analytics and insights
          </p>
        </div>
        <Link to='/invoices/analyze'>
          <Button>
            <FileText className='mr-2 size-4' />
            Analyze New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Invoices</CardTitle>
            <FileText className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalInvoices}</div>
            <p className='text-xs text-muted-foreground'>
              <span className='inline-flex items-center text-green-600'>
                <ArrowUpRight className='mr-1 size-3' />
                +12%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Spend</CardTitle>
            <DollarSign className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(stats.totalSpend)}</div>
            <p className='text-xs text-muted-foreground'>
              <span className='inline-flex items-center text-red-600'>
                <ArrowDownRight className='mr-1 size-3' />
                -5%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Savings Identified</CardTitle>
            <TrendingUp className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {formatCurrency(stats.savingsIdentified)}
            </div>
            <p className='text-xs text-muted-foreground'>5.4% of total spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending Review</CardTitle>
            <AlertCircle className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.pendingReview}</div>
            <p className='text-xs text-muted-foreground'>Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className='grid gap-4 lg:grid-cols-7'>
        {/* Recent Invoices */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest invoices processed by the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex items-center gap-4'>
                    <div className='rounded-full bg-primary/10 p-2'>
                      <Package className='size-4 text-primary' />
                    </div>
                    <div>
                      <p className='font-medium'>{invoice.invoiceNumber}</p>
                      <p className='text-sm text-muted-foreground'>
                        {invoice.carrier} • {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <p className='font-semibold'>{formatCurrency(invoice.amount)}</p>
                    <Badge variant={invoice.status === 'processed' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4'>
              <Link to='/invoices' className='w-full'>
                <Button variant='outline' className='w-full'>
                  View All Invoices
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Link to='/invoices/analyze'>
              <Button variant='outline' className='w-full justify-start' size='lg'>
                <FileText className='mr-2 size-4' />
                Upload New Invoice
              </Button>
            </Link>
            <Link to='/chat'>
              <Button variant='outline' className='w-full justify-start' size='lg'>
                <BarChart3 className='mr-2 size-4' />
                Chat with AI Assistant
              </Button>
            </Link>
            <Button variant='outline' className='w-full justify-start' size='lg' disabled>
              <TrendingUp className='mr-2 size-4' />
              Generate Report
              <Badge variant='secondary' className='ml-auto'>
                Soon
              </Badge>
            </Button>
            <Button variant='outline' className='w-full justify-start' size='lg' disabled>
              <DollarSign className='mr-2 size-4' />
              Cost Analysis
              <Badge variant='secondary' className='ml-auto'>
                Soon
              </Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Card */}
      <Card className='border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-600/5'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <div className='rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-1.5'>
              <BarChart3 className='size-4 text-white' />
            </div>
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Intelligent analysis of your invoice data</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 rounded-full bg-green-500/10 p-1'>
                <div className='size-2 rounded-full bg-green-500' />
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Potential savings detected</p>
                <p className='text-sm text-muted-foreground'>
                  We found $2,340 in potential savings on fuel surcharges across 5 invoices
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 rounded-full bg-yellow-500/10 p-1'>
                <div className='size-2 rounded-full bg-yellow-500' />
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Billing anomaly identified</p>
                <p className='text-sm text-muted-foreground'>
                  Invoice INV-002 shows unusual accessorial charges compared to historical data
                </p>
              </div>
            </div>
          </div>
          <Link to='/chat'>
            <Button variant='outline' className='w-full'>
              Explore with AI Assistant
              <ArrowUpRight className='ml-2 size-4' />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

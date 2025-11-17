import {
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  BarChart3,
  ArrowUpRight,
  Scale,
  Truck,
  Fuel,
  Receipt,
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
import { Progress } from '@/components/ui/progress'
import { Main } from '@/components/layout/main'

export function InvoiceDashboard() {
  // Mock data - replace with real data from API
  const stats = {
    totalInvoices: 24,
    totalShipments: 3480,
    totalBilled: 156750.0,
    totalPotentialSavings: 8420.0,
    totalFreight: 122500.0,
    totalFuel: 18200.0,
    totalExtraCharges: 11050.0,
    totalWeight: 52200, // in lbs
    pendingReview: 3,
  }

  // Calculated metrics
  const avgPerInvoice = stats.totalBilled / stats.totalInvoices
  const avgSavingsPerInvoice = stats.totalPotentialSavings / stats.totalInvoices
  const savingsPercent = (stats.totalPotentialSavings / stats.totalBilled) * 100

  const avgFreightPerShipment = stats.totalFreight / stats.totalShipments
  const avgFuelPerShipment = stats.totalFuel / stats.totalShipments
  const avgExtraChargesPerShipment = stats.totalExtraCharges / stats.totalShipments
  const avgWeightPerShipment = stats.totalWeight / stats.totalShipments

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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatWeight = (weight: number) => {
    return `${formatNumber(weight)} lbs`
  }

  return (
    <Main className='space-y-6'>
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

      {/* Primary Stats Cards */}
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
            <CardTitle className='text-sm font-medium'>Total Shipments</CardTitle>
            <Package className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatNumber(stats.totalShipments)}</div>
            <p className='text-xs text-muted-foreground'>
              Avg {Math.round(stats.totalShipments / stats.totalInvoices)} per invoice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Billed</CardTitle>
            <DollarSign className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(stats.totalBilled)}</div>
            <p className='text-xs text-muted-foreground'>
              Avg {formatCurrency(avgPerInvoice)} per invoice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Potential Savings</CardTitle>
            <TrendingUp className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {formatCurrency(stats.totalPotentialSavings)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {savingsPercent.toFixed(1)}% of total spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Breakdown */}
      <Card className='border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-600/5'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='size-5 text-green-600' />
                Savings Analysis
              </CardTitle>
              <CardDescription>Cost optimization opportunities across all invoices</CardDescription>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold text-green-600'>
                {formatCurrency(stats.totalPotentialSavings)}
              </div>
              <p className='text-sm text-muted-foreground'>
                {formatCurrency(avgSavingsPerInvoice)} avg per invoice
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Savings Percentage</span>
              <span className='text-sm text-muted-foreground'>{savingsPercent.toFixed(2)}%</span>
            </div>
            <Progress value={savingsPercent} className='h-2' />
            <p className='text-xs text-muted-foreground'>
              Based on {stats.totalInvoices} invoices with {formatNumber(stats.totalShipments)}{' '}
              shipments analyzed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Metrics */}
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Cost Breakdown</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Freight Costs */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Freight Costs</CardTitle>
              <Truck className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{formatCurrency(stats.totalFreight)}</div>
                <p className='text-xs text-muted-foreground'>Total across all invoices</p>
              </div>
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Shipment</span>
                  <span className='font-medium'>{formatCurrency(avgFreightPerShipment)}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Invoice</span>
                  <span className='font-medium'>
                    {formatCurrency(stats.totalFreight / stats.totalInvoices)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>% of Total</span>
                  <span className='font-medium'>
                    {((stats.totalFreight / stats.totalBilled) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Surcharge */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Fuel Surcharge</CardTitle>
              <Fuel className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{formatCurrency(stats.totalFuel)}</div>
                <p className='text-xs text-muted-foreground'>Total across all invoices</p>
              </div>
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Shipment</span>
                  <span className='font-medium'>{formatCurrency(avgFuelPerShipment)}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Invoice</span>
                  <span className='font-medium'>
                    {formatCurrency(stats.totalFuel / stats.totalInvoices)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>% of Total</span>
                  <span className='font-medium'>
                    {((stats.totalFuel / stats.totalBilled) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra Charges */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Extra Charges</CardTitle>
              <Receipt className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{formatCurrency(stats.totalExtraCharges)}</div>
                <p className='text-xs text-muted-foreground'>Total across all invoices</p>
              </div>
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Shipment</span>
                  <span className='font-medium'>{formatCurrency(avgExtraChargesPerShipment)}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Per Invoice</span>
                  <span className='font-medium'>
                    {formatCurrency(stats.totalExtraCharges / stats.totalInvoices)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>% of Total</span>
                  <span className='font-medium'>
                    {((stats.totalExtraCharges / stats.totalBilled) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipment Metrics */}
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Shipment Metrics</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Weight Analysis</CardTitle>
              <Scale className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{formatWeight(stats.totalWeight)}</div>
                <p className='text-xs text-muted-foreground'>Total weight shipped</p>
              </div>
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Average per Shipment</span>
                  <span className='font-medium'>{avgWeightPerShipment.toFixed(1)} lbs</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Average per Invoice</span>
                  <span className='font-medium'>
                    {formatWeight(Math.round(stats.totalWeight / stats.totalInvoices))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Processing Status</CardTitle>
              <BarChart3 className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{stats.totalInvoices} Invoices</div>
                <p className='text-xs text-muted-foreground'>Processed and analyzed</p>
              </div>
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Completed</span>
                  <span className='font-medium text-green-600'>
                    {stats.totalInvoices - stats.pendingReview}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Pending Review</span>
                  <span className='font-medium text-yellow-600'>{stats.pendingReview}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Success Rate</span>
                  <span className='font-medium'>
                    {(((stats.totalInvoices - stats.pendingReview) / stats.totalInvoices) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
                  We found {formatCurrency(stats.totalPotentialSavings)} in potential savings across{' '}
                  {stats.totalInvoices} invoices
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 rounded-full bg-yellow-500/10 p-1'>
                <div className='size-2 rounded-full bg-yellow-500' />
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Cost trend analysis</p>
                <p className='text-sm text-muted-foreground'>
                  Average shipment cost is {formatCurrency(stats.totalBilled / stats.totalShipments)}{' '}
                  with {avgWeightPerShipment.toFixed(1)} lbs average weight
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
    </Main>
  )
}

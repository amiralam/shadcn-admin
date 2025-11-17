import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Download,
  FileText,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Package,
  Scale,
  Calendar,
  Building,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

// Mock data - replace with real API
const mockInvoiceDetail = {
  id: '1',
  jobId: 'job-001',
  invoiceNumber: 'INV-2024-001',
  accountNumber: 'ACC-12345',
  carrier: 'DHL',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  createdAt: '2024-01-15T10:30:00Z',
  status: 'completed',

  // Summary Metrics
  summary: {
    totalShipments: 145,
    analyzedShipments: 100,
    totalBilled: 12500.0,
    freightCost: 9800.0,
    fuelSurcharge: 1450.0,
    extraCharges: 980.0,
    dutiesTaxes: 150.0,
    discounts: -80.0,
    vatAmount: 200.0,
  },

  // Potential Savings
  potentialSavings: {
    total: 1250.0,
    rateDiscrepancies: {
      amount: 450.0,
      count: 12,
      description: 'Invoiced rates higher than expected rates',
    },
    weightDiscrepancies: {
      amount: 320.0,
      count: 8,
      description: 'Declared weight differs from carrier-scanned weight',
    },
    volumeDiscrepancies: {
      amount: 280.0,
      count: 6,
      description: 'Declared dimensions differ from carrier-scanned',
    },
    duplicateBilling: {
      amount: 200.0,
      count: 3,
      description: 'Tracking codes already billed',
    },
  },

  // Extra Charges
  extraCharges: [
    {
      name: 'Residential Delivery',
      description: 'Delivery to residential address',
      shipmentsCount: 45,
      totalAmount: 450.0,
      avgCharge: 10.0,
      percentOfTotal: 3.6,
    },
    {
      name: 'Fuel Surcharge',
      description: 'Variable fuel cost adjustment',
      shipmentsCount: 100,
      totalAmount: 1450.0,
      avgCharge: 14.5,
      percentOfTotal: 11.6,
    },
    {
      name: 'Extended Area',
      description: 'Delivery to remote location',
      shipmentsCount: 18,
      totalAmount: 270.0,
      avgCharge: 15.0,
      percentOfTotal: 2.2,
    },
    {
      name: 'Address Correction',
      description: 'Address correction fee',
      shipmentsCount: 12,
      totalAmount: 180.0,
      avgCharge: 15.0,
      percentOfTotal: 1.4,
    },
  ],

  // Spend Breakdown
  spendBreakdown: [
    { range: '$0-$50', count: 35, amount: 1200.0, percent: 9.6 },
    { range: '$50-$100', count: 48, amount: 3600.0, percent: 28.8 },
    { range: '$100-$150', count: 32, amount: 3800.0, percent: 30.4 },
    { range: '$150-$200', count: 20, amount: 3400.0, percent: 27.2 },
    { range: '$200+', count: 10, amount: 500.0, percent: 4.0 },
  ],

  // Weight Breakdown
  weightBreakdown: [
    { range: '0-5 lbs', count: 45, percent: 31.0 },
    { range: '5-10 lbs', count: 38, percent: 26.2 },
    { range: '10-20 lbs', count: 32, percent: 22.1 },
    { range: '20-50 lbs', count: 22, percent: 15.2 },
    { range: '50+ lbs', count: 8, percent: 5.5 },
  ],
}

export function InvoiceDetail() {
  // In production, fetch invoiceId from params and data from API
  // const { invoiceId } = useParams({ from: '/_authenticated/invoices/$invoiceId/' })
  // const { data: invoice } = useQuery({
  //   queryKey: ['invoice', invoiceId],
  //   queryFn: () => fetchInvoice(invoiceId),
  // })
  const invoice = mockInvoiceDetail

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDownloadReport = () => {
    // Implement PDF/Excel export
    console.log('Downloading report for invoice:', invoice.invoiceNumber)
  }

  const analysisProgress = (invoice.summary.analyzedShipments / invoice.summary.totalShipments) * 100

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link to='/invoices'>
            <Button variant='outline' size='icon'>
              <ArrowLeft className='size-4' />
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{invoice.invoiceNumber}</h1>
            <p className='text-muted-foreground'>
              {invoice.carrier} • {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadReport}>
          <Download className='mr-2 size-4' />
          Download Report
        </Button>
      </div>

      {/* Invoice Header Info */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <FileText className='size-4' />
                <span>Invoice Number</span>
              </div>
              <p className='font-semibold'>{invoice.invoiceNumber}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Building className='size-4' />
                <span>Account Number</span>
              </div>
              <p className='font-semibold'>{invoice.accountNumber}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='size-4' />
                <span>Invoice Date</span>
              </div>
              <p className='font-semibold'>{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='size-4' />
                <span>Due Date</span>
              </div>
              <p className='font-semibold'>{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Analysis Progress</span>
              <span className='text-sm text-muted-foreground'>
                {invoice.summary.analyzedShipments} / {invoice.summary.totalShipments} shipments
              </span>
            </div>
            <Progress value={analysisProgress} className='h-2' />
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Billed</CardTitle>
            <DollarSign className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(invoice.summary.totalBilled)}</div>
            <p className='text-xs text-muted-foreground'>
              {invoice.summary.totalShipments} shipments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Freight Cost</CardTitle>
            <Package className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(invoice.summary.freightCost)}</div>
            <p className='text-xs text-muted-foreground'>
              {((invoice.summary.freightCost / invoice.summary.totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fuel Surcharge</CardTitle>
            <TrendingDown className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(invoice.summary.fuelSurcharge)}</div>
            <p className='text-xs text-muted-foreground'>
              {((invoice.summary.fuelSurcharge / invoice.summary.totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Extra Charges</CardTitle>
            <AlertTriangle className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(invoice.summary.extraCharges)}</div>
            <p className='text-xs text-muted-foreground'>
              {((invoice.summary.extraCharges / invoice.summary.totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Potential Savings */}
      <Card className='border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-600/5'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <TrendingDown className='size-5 text-green-600' />
                Potential Savings Identified
              </CardTitle>
              <CardDescription>Analysis of cost optimization opportunities</CardDescription>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold text-green-600'>
                {formatCurrency(invoice.potentialSavings.total)}
              </div>
              <p className='text-sm text-muted-foreground'>
                {((invoice.potentialSavings.total / invoice.summary.totalBilled) * 100).toFixed(1)}% savings potential
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2 rounded-lg border bg-background p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='font-semibold'>Rate Discrepancies</h4>
                <Badge variant='secondary'>{invoice.potentialSavings.rateDiscrepancies.count} issues</Badge>
              </div>
              <p className='text-2xl font-bold text-green-600'>
                {formatCurrency(invoice.potentialSavings.rateDiscrepancies.amount)}
              </p>
              <p className='text-sm text-muted-foreground'>
                {invoice.potentialSavings.rateDiscrepancies.description}
              </p>
            </div>

            <div className='space-y-2 rounded-lg border bg-background p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='font-semibold'>Weight Discrepancies</h4>
                <Badge variant='secondary'>{invoice.potentialSavings.weightDiscrepancies.count} issues</Badge>
              </div>
              <p className='text-2xl font-bold text-green-600'>
                {formatCurrency(invoice.potentialSavings.weightDiscrepancies.amount)}
              </p>
              <p className='text-sm text-muted-foreground'>
                {invoice.potentialSavings.weightDiscrepancies.description}
              </p>
            </div>

            <div className='space-y-2 rounded-lg border bg-background p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='font-semibold'>Volume Discrepancies</h4>
                <Badge variant='secondary'>{invoice.potentialSavings.volumeDiscrepancies.count} issues</Badge>
              </div>
              <p className='text-2xl font-bold text-green-600'>
                {formatCurrency(invoice.potentialSavings.volumeDiscrepancies.amount)}
              </p>
              <p className='text-sm text-muted-foreground'>
                {invoice.potentialSavings.volumeDiscrepancies.description}
              </p>
            </div>

            <div className='space-y-2 rounded-lg border bg-background p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='font-semibold'>Duplicate Billing</h4>
                <Badge variant='secondary'>{invoice.potentialSavings.duplicateBilling.count} issues</Badge>
              </div>
              <p className='text-2xl font-bold text-green-600'>
                {formatCurrency(invoice.potentialSavings.duplicateBilling.amount)}
              </p>
              <p className='text-sm text-muted-foreground'>
                {invoice.potentialSavings.duplicateBilling.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extra Charges Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Extra Charges Analysis</CardTitle>
          <CardDescription>Detailed breakdown of additional charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Charge Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className='text-right'>Shipments</TableHead>
                  <TableHead className='text-right'>Total Amount</TableHead>
                  <TableHead className='text-right'>Avg Charge</TableHead>
                  <TableHead className='text-right'>% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.extraCharges.map((charge, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{charge.name}</TableCell>
                    <TableCell className='text-muted-foreground'>{charge.description}</TableCell>
                    <TableCell className='text-right'>{charge.shipmentsCount}</TableCell>
                    <TableCell className='text-right font-medium'>
                      {formatCurrency(charge.totalAmount)}
                    </TableCell>
                    <TableCell className='text-right'>{formatCurrency(charge.avgCharge)}</TableCell>
                    <TableCell className='text-right'>{charge.percentOfTotal.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Spend & Weight Breakdown */}
      <div className='grid gap-4 lg:grid-cols-2'>
        {/* Spend Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='size-5' />
              Spend Breakdown by Cost Range
            </CardTitle>
            <CardDescription>Distribution of shipment costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {invoice.spendBreakdown.map((range, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{range.range}</span>
                    <span className='text-muted-foreground'>
                      {range.count} shipments • {formatCurrency(range.amount)}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Progress value={range.percent} className='h-2 flex-1' />
                    <span className='text-xs text-muted-foreground'>{range.percent.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weight Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Scale className='size-5' />
              Weight Breakdown by Range
            </CardTitle>
            <CardDescription>Distribution of shipment weights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {invoice.weightBreakdown.map((range, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{range.range}</span>
                    <span className='text-muted-foreground'>{range.count} shipments</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Progress value={range.percent} className='h-2 flex-1' />
                    <span className='text-xs text-muted-foreground'>{range.percent.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

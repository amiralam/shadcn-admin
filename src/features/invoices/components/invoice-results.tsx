import { useState } from 'react'
import {
  Download,
  FileSpreadsheet,
  DollarSign,
  Package,
  TrendingUp,
  ChevronLeft,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ResultsResponse } from '../data/schema'

interface InvoiceResultsProps {
  results: ResultsResponse['data']
  onBack: () => void
}

export function InvoiceResults({ results, onBack }: InvoiceResultsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { extracted_fields, accessorial_costs, summary } = results.results

  // Pagination for extracted fields
  const totalPages = Math.ceil(extracted_fields.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFields = extracted_fields.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Analysis Results</h2>
          <p className='text-muted-foreground'>
            Job ID: <code className='text-xs'>{results.job_id}</code>
          </p>
        </div>
        <Button variant='outline' onClick={onBack}>
          <ChevronLeft className='mr-2 size-4' />
          Back to Upload
        </Button>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Records</CardTitle>
            <Package className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.total_records}</div>
            <p className='text-xs text-muted-foreground'>Shipments processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Freight</CardTitle>
            <DollarSign className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(summary.total_freight)}</div>
            <p className='text-xs text-muted-foreground'>Base shipping costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Fuel</CardTitle>
            <TrendingUp className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(summary.total_fuel)}</div>
            <p className='text-xs text-muted-foreground'>Fuel surcharges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Amount</CardTitle>
            <FileSpreadsheet className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(summary.total_amount)}</div>
            <p className='text-xs text-muted-foreground'>
              Including {formatCurrency(summary.total_accessorial)} accessorial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue='shipments' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='shipments'>
            Extracted Shipments ({extracted_fields.length})
          </TabsTrigger>
          <TabsTrigger value='accessorial'>
            Accessorial Costs ({accessorial_costs.length})
          </TabsTrigger>
        </TabsList>

        {/* Shipments Table */}
        <TabsContent value='shipments' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Extracted Shipments</CardTitle>
                  <CardDescription>
                    Detailed breakdown of all shipments in the invoice
                  </CardDescription>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => exportToCSV(extracted_fields, 'shipments.csv')}
                >
                  <Download className='mr-2 size-4' />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead className='text-right'>Weight</TableHead>
                      <TableHead className='text-right'>Freight</TableHead>
                      <TableHead className='text-right'>Fuel</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFields.length > 0 ? (
                      paginatedFields.map((field, index) => (
                        <TableRow key={index}>
                          <TableCell className='font-mono text-xs'>
                            {field.tracking_number}
                          </TableCell>
                          <TableCell className='font-mono text-xs'>
                            {field.invoice_number}
                          </TableCell>
                          <TableCell className='text-right'>{field.weight}</TableCell>
                          <TableCell className='text-right'>
                            {formatCurrency(field.freight_cost)}
                          </TableCell>
                          <TableCell className='text-right'>
                            {formatCurrency(field.fuel_cost)}
                          </TableCell>
                          <TableCell className='text-right font-medium'>
                            {formatCurrency(field.total_billed)}
                          </TableCell>
                          <TableCell>{field.origin_country || '-'}</TableCell>
                          <TableCell>{field.dest_country || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className='text-center text-muted-foreground'>
                          No shipments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-between pt-4'>
                  <p className='text-sm text-muted-foreground'>
                    Showing {startIndex + 1} to {Math.min(endIndex, extracted_fields.length)} of{' '}
                    {extracted_fields.length} records
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessorial Costs Table */}
        <TabsContent value='accessorial' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Accessorial Costs</CardTitle>
                  <CardDescription>
                    Additional charges and fees applied to shipments
                  </CardDescription>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => exportToCSV(accessorial_costs, 'accessorial-costs.csv')}
                >
                  <Download className='mr-2 size-4' />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Charge Name</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessorial_costs.length > 0 ? (
                      accessorial_costs.map((cost, index) => (
                        <TableRow key={index}>
                          <TableCell className='font-mono text-xs'>
                            {cost.master_tracking_code}
                          </TableCell>
                          <TableCell className='capitalize'>
                            {cost.charge_category.replace('_', ' ')}
                          </TableCell>
                          <TableCell className='capitalize'>
                            {cost.charge_name.replace('_', ' ')}
                          </TableCell>
                          <TableCell className='text-right font-medium'>
                            {formatCurrency(cost.charge_amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center text-muted-foreground'>
                          No accessorial costs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

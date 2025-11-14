import { useCallback, useState } from 'react'
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface InvoiceUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  error?: string | null
}

const ACCEPTED_FILE_TYPES = [
  '.csv',
  '.xlsx',
  '.xls',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]

export function InvoiceUpload({ onFileSelect, isLoading = false, error }: InvoiceUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const isValidType =
      ACCEPTED_FILE_TYPES.includes(fileExtension) ||
      ACCEPTED_FILE_TYPES.includes(file.type)

    if (!isValidType) {
      setValidationError('Invalid file type. Please upload a CSV, XLS, or XLSX file.')
      return false
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setValidationError('File size exceeds 50MB. Please upload a smaller file.')
      return false
    }

    setValidationError(null)
    return true
  }

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    },
    []
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setValidationError(null)
  }

  const displayError = error || validationError

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='pt-6'>
          <div
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
              isDragActive && 'border-primary bg-primary/5',
              !isDragActive && 'border-muted-foreground/25',
              isLoading && 'pointer-events-none opacity-50'
            )}
          >
            <div className='flex flex-col items-center justify-center gap-4 text-center'>
              <div className='rounded-full bg-primary/10 p-4'>
                <Upload className='size-8 text-primary' />
              </div>

              <div className='space-y-2'>
                <h3 className='text-lg font-semibold'>Upload Invoice Document</h3>
                <p className='text-sm text-muted-foreground'>
                  Drag and drop your file here, or click to browse
                </p>
                <p className='text-xs text-muted-foreground'>
                  Supports CSV, XLS, XLSX (Max 50MB)
                </p>
              </div>

              <input
                type='file'
                accept={ACCEPTED_FILE_TYPES.join(',')}
                onChange={handleFileInput}
                className='absolute inset-0 cursor-pointer opacity-0'
                disabled={isLoading}
              />

              <Button type='button' variant='outline' disabled={isLoading}>
                Browse Files
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className='mt-4 rounded-lg border bg-muted/50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded bg-primary/10 p-2'>
                    <FileSpreadsheet className='size-5 text-primary' />
                  </div>
                  <div>
                    <p className='font-medium'>{selectedFile.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  <X className='size-4' />
                </Button>
              </div>

              <div className='mt-4'>
                <Button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className='w-full'
                >
                  {isLoading ? 'Uploading...' : 'Upload and Analyze'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {displayError && (
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useMutation } from "@apollo/client"
import { Upload, FileImage, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { UPLOAD_RECEIPT } from "@/lib/graphql/mutations"
import { ReceiptData } from "@/types/receipt"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onUploadStart: () => void
  onUploadProgress: (progress: number) => void
  onUploadComplete: () => void
  onProcessingComplete: (data: ReceiptData) => void
  onError: (error: string) => void
}

export function UploadZone({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onProcessingComplete,
  onError,
}: UploadZoneProps) {
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const [uploadReceipt] = useMutation<{ uploadReceipt: ReceiptData }>(UPLOAD_RECEIPT)

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, JPEG, or PNG)'
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);

  const handleUpload = async (file: File) => {
    const validation = validateFile(file)
    if (validation) {
      setValidationError(validation)
      return
    }

    setValidationError(null)
    onUploadStart()
    setSimulatedProgress(0);

    try {
      // Simulate upload progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + Math.random() * 20, 90);
        setSimulatedProgress(currentProgress);
        onUploadProgress(currentProgress);
        if (currentProgress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200)

      const { data } = await uploadReceipt({
        variables: { file },
        context: {
          fetchOptions: {
            onUploadProgress: (progressEvent: ProgressEvent) => {
              const progress = (progressEvent.loaded / progressEvent.total) * 100
              onUploadProgress(progress)
            },
          },
        },
      })

      clearInterval(progressInterval)
      setSimulatedProgress(100);
      onUploadProgress(100)
      onUploadComplete()

      // Simulate OCR processing time
      setTimeout(() => {
        if (data?.uploadReceipt) {
          onProcessingComplete(data.uploadReceipt)
          toast.success("Receipt uploaded and processed successfully!")
        }
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onError(errorMessage)
      toast.error(errorMessage || "An error occurred during upload")
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10",
          isDragReject && "border-destructive bg-destructive/10"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <FileImage className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop your receipt here" : "Upload Receipt Image"}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop your receipt image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, JPEG, PNG (max 10MB)
            </p>
          </div>
          
          <Button variant="outline" className="mt-4">
            Choose File
          </Button>
        </div>
      </div>

      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

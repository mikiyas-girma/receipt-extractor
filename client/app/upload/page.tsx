"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadZone } from "@/components/upload-zone"
import { UploadProgress } from "@/components/upload-progress"
import { OCRStatus } from "@/components/ocr-status"
import { ResultsDisplay } from "@/components/results-display"
import { ReceiptData } from "@/types/receipt"

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUploadStart = () => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setReceiptData(null)
  }

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress)
  }

  const handleUploadComplete = () => {
    setIsUploading(false)
    setIsProcessing(true)
  }

  const handleProcessingComplete = (data: ReceiptData) => {
    setIsProcessing(false)
    setReceiptData(data)
  }

  const handleError = (errorMessage: string) => {
    setIsUploading(false)
    setIsProcessing(false)
    setError(errorMessage)
  }

  const handleReset = () => {
    setUploadProgress(0)
    setIsUploading(false)
    setIsProcessing(false)
    setReceiptData(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
        <p className="text-muted-foreground">
          Upload your receipt image
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Upload</CardTitle>
          <CardDescription>
            Drag and drop your receipt image or click to Browse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isUploading && !isProcessing && !receiptData && (
            <UploadZone
              onUploadStart={handleUploadStart}
              onUploadProgress={handleUploadProgress}
              onUploadComplete={handleUploadComplete}
              onProcessingComplete={handleProcessingComplete}
              onError={handleError}
            />
          )}

          {isUploading && (
            <UploadProgress progress={uploadProgress} />
          )}

          {isProcessing && (
            <OCRStatus />
          )}

          {receiptData && (
            <ResultsDisplay 
              data={receiptData} 
              onReset={handleReset}
            />
          )}

          {error && (
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="text-primary hover:underline"
              >
                Try again ...
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Progress } from "@/components/ui/progress"
import { Upload } from 'lucide-react'

interface UploadProgressProps {
  progress: number
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Upload className="w-8 h-8 text-primary animate-pulse" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Uploading Receipt</h3>
        <p className="text-muted-foreground">
          Please wait while we upload your receipt image
        </p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  )
}

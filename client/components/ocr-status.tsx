"use client"

import { CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export function OCRStatus() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Processing Receipt</h3>
        <p className="text-muted-foreground">
          extracting data from your receipt
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Upload Complete</span>
          </div>
          <Badge variant="secondary">Done</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span>OCR Processing</span>
          </div>
          <Badge className="animate-pulse">Processing</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span>Results Ready</span>
          </div>
          <Badge variant="outline">Pending</Badge>
        </div>
      </div>
    </div>
  )
}

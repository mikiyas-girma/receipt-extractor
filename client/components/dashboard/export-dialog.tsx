"use client"

import { useState } from "react"
import { Download, FileText, Database } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { ReceiptData } from "@/types/receipt"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"
import { toast } from 'sonner'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ReceiptData[]
}

export function ExportDialog({ open, onOpenChange, data }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export", {
        description: "There are no receipts to export."
      })
      return
    }

    try {
      if (exportFormat === "csv") {
        exportToCSV(data)
      } else {
        exportToJSON(data)
      }

      toast.success("Export successful", {
        description: `${data.length} receipts exported as ${exportFormat.toUpperCase()}`,
      })

      onOpenChange(false)
    } catch (error) {

      toast.error("Export failed", {
        description: "There was an error exporting your data.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Export {data.length} receipts in your preferred format</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    CSV (Comma Separated Values)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    JSON (JavaScript Object Notation)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={data.length === 0} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Database, Plus } from "lucide-react"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { FilterProvider, useFilters } from "@/components/dashboard/filter-context"
import { GET_RECEIPTS } from "@/lib/graphql/queries"
import type { ReceiptData } from "@/types/receipt"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

function ExportContent() {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")
  const { filters } = useFilters()

  const { data, loading, error, refetch } = useQuery<{ receipts: ReceiptData[] }>(GET_RECEIPTS, {
    variables: {
      startDate: filters.dateRange?.from?.toISOString(),
      endDate: filters.dateRange?.to?.toISOString(),
      storeName: filters.storeName || undefined,
    },
    fetchPolicy: "cache-and-network",
  })

  const receipts = data?.receipts || []

  const handleExport = () => {
    if (receipts.length === 0) {
      toast.info("No data to export", {
        description: "Please adjust your filters to include some receipts.",
      })
      return
    }

    try {
      if (exportFormat === "csv") {
        exportToCSV(receipts)
      } else {
        exportToJSON(receipts)
      }

      toast.success(" Export successful", {
        description: `${receipts.length} receipts exported as ${exportFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast.error("Export failed", {
        description: "There was an error exporting your data. Please try again.",
      })
      console.error("Export error:", error)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Failed to load data</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
          <p className="text-muted-foreground">Export your receipt data in various formats</p>
        </div>
        <Button asChild variant="default">
          <Link href="/upload">
            <Plus className="w-4 h-4 mr-2" />
            Upload Receipt
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Filters</CardTitle>
            <CardDescription>Configure which data to export</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardFilters />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
            <CardDescription>Choose your export format and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
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

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Records to Export</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Loading..." : `${receipts.length} receipts match your filters`}
                  </p>
                </div>
                {loading && <Skeleton className="h-6 w-16" />}
              </div>

              <Button onClick={handleExport} disabled={loading || receipts.length === 0} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <CardDescription>Preview of data that will be exported</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              ))}
            </div>
          ) : receipts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No data matches your current filters</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <span>Store</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Items</span>
              </div>
              {receipts.slice(0, 10).map((receipt) => (
                <div key={receipt.id} className="grid grid-cols-4 gap-4 text-sm py-2">
                  <span className="truncate">{receipt.storeName || "Unknown"}</span>
                  <span>{receipt.purchaseDate ? new Date(parseInt(receipt.purchaseDate)).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  }) : "Unknown"}</span>
                  <span>${receipt.totalAmount?.toFixed(2) || "0.00"}</span>
                  <span>{receipt.items?.length || 0} items</span>
                </div>
              ))}
              {receipts.length > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  ... and {receipts.length - 10} more records
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ExportPage() {
  return (
    <FilterProvider>
      <ExportContent />
    </FilterProvider>
  )
}

"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { ReceiptsTable } from "@/components/dashboard/receipts-table"
import { ReceiptsFilters } from "@/components/dashboard/receipts-filters"
import { ExportDialog } from "@/components/dashboard/export-dialog"
import { useFilters } from "@/components/dashboard/filter-context"
import { GET_RECEIPTS } from "@/lib/graphql/queries"
import type { ReceiptData } from "@/types/receipt"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReceiptsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [showExport, setShowExport] = useState(false)
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Failed to load receipts</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
          <p className="text-muted-foreground">Manage and view all your processed receipts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button onClick={() => setShowExport(true)} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter receipts by date range and store name</CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptsFilters />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Receipts ({loading ? "..." : receipts.length})</CardTitle>
          <CardDescription>View and manage your receipt data</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ReceiptsTableSkeleton />
          ) : receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No receipts found</p>
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
          ) : (
            <ReceiptsTable data={receipts} />
          )}
        </CardContent>
      </Card>

      <ExportDialog open={showExport} onOpenChange={setShowExport} data={receipts} />
    </div>
  )
}

function ReceiptsTableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  )
}

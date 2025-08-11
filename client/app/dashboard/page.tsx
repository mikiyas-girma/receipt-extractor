"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, Plus } from "lucide-react"
import { ReceiptsTable } from "@/components/dashboard/receipts-table"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { ExportDialog } from "@/components/dashboard/export-dialog"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { FilterProvider, useFilters } from "@/components/dashboard/filter-context"
import { GET_RECEIPTS } from "@/lib/graphql/queries"
import type { ReceiptData } from "@/types/receipt"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

function DashboardContent() {
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your receipt data and recent uploads</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="default">
            <Link href="/upload">
              <Plus className="w-4 h-4 mr-2" />
              Upload Receipt
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats data={receipts} loading={loading} />

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter receipts by date range and store name</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardFilters />
          </CardContent>
        </Card>
      )}

      {/* Recent Receipts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Receipts ({loading ? "..." : receipts.length})</CardTitle>
              <CardDescription>Your latest processed receipts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/images">View Images</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ReceiptsTableSkeleton />
          ) : receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No receipts found</p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/upload">Upload Your First Receipt</Link>
                </Button>
                <Button variant="outline" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
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

export default function DashboardPage() {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
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

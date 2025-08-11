"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Plus } from "lucide-react"
import { ImagesGrid } from "@/components/dashboard/images-grid"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { FilterProvider, useFilters } from "@/components/dashboard/filter-context"
import { GET_RECEIPT_IMAGES } from "@/lib/graphql/queries"
import type { ReceiptData } from "@/types/receipt"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

function ImagesContent() {
  const [showFilters, setShowFilters] = useState(false)
  const { filters } = useFilters()

  const { data, loading, error, refetch } = useQuery<{ receipts: ReceiptData[] }>(GET_RECEIPT_IMAGES, {
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
            <p className="text-destructive mb-4">Failed to load images</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Receipt Images</h1>
          <p className="text-muted-foreground">Browse all uploaded receipt images</p>
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
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter images by date range and store name</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardFilters />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Receipt Images ({loading ? "..." : receipts.length})</CardTitle>
          <CardDescription>Click on any image to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ImagesGridSkeleton />
          ) : receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No images found</p>
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
            <ImagesGrid data={receipts} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ImagesPage() {
  return (
    <FilterProvider>
      <ImagesContent />
    </FilterProvider>
  )
}

function ImagesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

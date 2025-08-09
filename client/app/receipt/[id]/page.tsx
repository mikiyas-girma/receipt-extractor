"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@apollo/client"
import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Calendar, Store, DollarSign, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GET_RECEIPT } from "@/lib/graphql/queries"
import { ReceiptData } from "@/types/receipt"
import { formatDate, formatCurrency } from "@/lib/utils"

export default function ReceiptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const { data, loading, error } = useQuery<{ receipt: ReceiptData }>(GET_RECEIPT, {
    variables: { id: params.id },
  })

  if (loading) {
    return <ReceiptDetailSkeleton />
  }

  if (error || !data?.receipt) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Receipt Not Found</h1>
        <p className="text-muted-foreground">
          The receipt you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push("/upload")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
      </div>
    )
  }

  const receipt = data.receipt

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Receipt Details</h1>
          <p className="text-muted-foreground">
            Uploaded {formatDate(receipt.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0" />
              )}
              <Image
                src={receipt.imageUrl || "/placeholder.svg"}
                alt="Receipt"
                fill
                className="object-contain"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Section */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Receipt Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Store</p>
                  <p className="font-medium">{receipt.storeName || "Unknown"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">
                      {receipt.purchaseDate ? formatDate(receipt.purchaseDate) : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg font-semibold">Total Amount</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {formatCurrency(receipt.totalAmount)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Card */}
          {receipt.items && receipt.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items ({receipt.items.length})
                </CardTitle>
                <CardDescription>
                  Extracted items from the receipt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity || 1}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ReceiptDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-[3/4] w-full" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

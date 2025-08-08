"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Store, DollarSign, Package, Eye, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReceiptData } from "@/types/receipt"
import { formatDate, formatCurrency } from "@/lib/utils"

interface ResultsDisplayProps {
  data: ReceiptData
  onReset: () => void
}

export function ResultsDisplay({ data, onReset }: ResultsDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-700">Processing Complete!</h3>
        <p className="text-muted-foreground">
          We've successfully extracted data from your receipt
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receipt Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <Image
                src={data.imageUrl || "/placeholder.svg"}
                alt="Receipt"
                fill
                className="object-contain"
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/receipt/${data.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-4 h-4" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Store Name</p>
                <p className="font-medium">{data.storeName || "Not detected"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">
                    {data.purchaseDate ? formatDate(data.purchaseDate) : "Not detected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.totalAmount)}
              </div>
            </CardContent>
          </Card>

          {data.items && data.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Items ({data.items.length})
                </CardTitle>
                <CardDescription>
                  Detected items from receipt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.items.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.quantity || 1}
                      </Badge>
                    </div>
                  ))}
                  {data.items.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{data.items.length - 5} more items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href={`/receipt/${data.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Full Details
          </Link>
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
      </div>
    </div>
  )
}

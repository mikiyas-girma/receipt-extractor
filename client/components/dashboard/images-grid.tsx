"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Calendar, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ReceiptData } from "@/types/receipt"
import { formatDate, formatCurrency } from "@/lib/utils"

interface ImagesGridProps {
  data: ReceiptData[]
}

export function ImagesGrid({ data }: ImagesGridProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((receipt) => (
          <Card
            key={receipt.id}
            className="group cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedReceipt(receipt)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] bg-muted rounded-t-lg overflow-hidden">
                <Image
                  src={receipt.imageUrl || "/placeholder.svg"}
                  alt={`Receipt from ${receipt.storeName || "Unknown Store"}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReceipt(receipt)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium truncate">{receipt.storeName || "Unknown Store"}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{receipt.purchaseDate ? formatDate(receipt.purchaseDate) : "Unknown"}</span>
                  <Badge variant="secondary" className="text-xs">
                    {formatCurrency(receipt.totalAmount || 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReceipt && (
            <>
              <DialogHeader>
                <DialogTitle>Receipt Details</DialogTitle>
                <DialogDescription>View receipt image and extracted data</DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={selectedReceipt.imageUrl || "/placeholder.svg"}
                      alt="Receipt"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Store</p>
                        <p className="font-medium">{selectedReceipt.storeName || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {selectedReceipt.purchaseDate ? formatDate(selectedReceipt.purchaseDate) : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedReceipt.totalAmount || 0)}
                      </p>
                    </div>
                  </div>

                  {selectedReceipt.items && selectedReceipt.items.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="font-medium mb-3">Items ({selectedReceipt.items.length})</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedReceipt.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm">{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.quantity || 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

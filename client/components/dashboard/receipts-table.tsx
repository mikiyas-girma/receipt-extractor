"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, ArrowUpDown, Eye, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import type { ReceiptData } from "@/types/receipt"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ReceiptsTableProps {
  data: ReceiptData[]
}

type SortField = "storeName" | "purchaseDate" | "totalAmount"
type SortDirection = "asc" | "desc"

export function ReceiptsTable({ data }: ReceiptsTableProps) {
  const [sortField, setSortField] = useState<SortField>("purchaseDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => { 
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortField === "purchaseDate") {
      const aDate = new Date(aValue || 0).getTime()
      const bDate = new Date(bValue || 0).getTime()
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate
    } 
    
    if (sortField === "totalAmount") {
      const aAmount = Number(aValue || 0)
      const bAmount = Number(bValue || 0)
      return sortDirection === "asc" ? aAmount - bAmount : bAmount - aAmount
    }
    
    // Handle string comparison (storeName)
    const aString = String(aValue || "").toLowerCase()
    const bString = String(bValue || "").toLowerCase()
    return sortDirection === "asc" 
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString)
  })

  if (isMobile) {
    return <MobileReceiptsList data={sortedData} />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("storeName")} className="h-auto p-0 font-medium">
                Store Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("purchaseDate")} className="h-auto p-0 font-medium">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("totalAmount")} className="h-auto p-0 font-medium">
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={receipt.imageUrl || "/placeholder.svg"}
                    alt="Receipt"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{receipt.storeName || "Unknown Store"}</TableCell>
              <TableCell>{receipt.purchaseDate ? formatDate(receipt.purchaseDate) : "Unknown"}</TableCell>
              <TableCell>
                <Badge variant="secondary">{formatCurrency(receipt.totalAmount || 0)}</Badge>
              </TableCell>
              <TableCell>{receipt.items?.length || 0} items</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/receipt/${receipt.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={receipt.imageUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Image
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MobileReceiptsList({ data }: { data: ReceiptData[] }) {
  return (
    <div className="space-y-4">
      {data.map((receipt) => (
        <Card key={receipt.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image src={receipt.imageUrl || "/placeholder.svg"} alt="Receipt" fill className="object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{receipt.storeName || "Unknown Store"}</h3>
                  <Badge variant="secondary">{formatCurrency(receipt.totalAmount || 0)}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{receipt.purchaseDate ? formatDate(receipt.purchaseDate) : "Unknown date"}</p>
                  <p>{receipt.items?.length || 0} items</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/receipt/${receipt.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Receipt, Store, TrendingUp } from "lucide-react"
import type { ReceiptData } from "@/types/receipt"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStatsProps {
  data: ReceiptData[]
  loading: boolean
}

export function DashboardStats({ data, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalReceipts = data.length
  const totalAmount = data.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0)
  const uniqueStores = new Set(data.map((receipt) => receipt.storeName).filter(Boolean)).size
  const averageAmount = totalReceipts > 0 ? totalAmount / totalReceipts : 0

  const stats = [
    {
      title: "Total Receipts",
      value: totalReceipts.toString(),
      description: "Processed receipts",
      icon: Receipt,
    },
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount),
      description: "Sum of all receipts",
      icon: DollarSign,
    },
    {
      title: "Unique Stores",
      value: uniqueStores.toString(),
      description: "Different stores",
      icon: Store,
    },
    {
      title: "Average Amount",
      value: formatCurrency(averageAmount),
      description: "Per receipt",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { FilterProvider } from "@/components/dashboard/filter-context"

export default function ReceiptsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FilterProvider>{children}</FilterProvider>
} 

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DateRange } from "react-day-picker"

interface FilterState {
  dateRange?: DateRange
  storeName?: string
  search?: string
}

interface FilterContextType {
  filters: FilterState
  updateFilters: (updates: Partial<FilterState>) => void
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({})

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return <FilterContext.Provider value={{ filters, updateFilters, clearFilters }}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}

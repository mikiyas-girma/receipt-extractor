"use client"

import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFilters } from "./filter-context"
import { formatDate, cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export function ImagesFilters() {
  const { filters, updateFilters, clearFilters } = useFilters()

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    updateFilters({ dateRange })
  }

  const hasActiveFilters = filters.dateRange || filters.storeName

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {formatDate(filters.dateRange.from.toISOString())} -{" "}
                      {formatDate(filters.dateRange.to.toISOString())}
                    </>
                  ) : (
                    formatDate(filters.dateRange.from.toISOString())
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            placeholder="Filter by store name..."
            value={filters.storeName || ""}
            onChange={(e) => updateFilters({ storeName: e.target.value })}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm text-muted-foreground">Filters applied</p>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 lg:px-3">
            Clear filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

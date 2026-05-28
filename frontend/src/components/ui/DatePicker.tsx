import { useState, useRef, useEffect } from "react"
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function DatePicker({ value, onChange, placeholder = "DD-MM-YYYY" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    // Default to selected value or current date
    const parsed = parseDateString(value)
    return parsed && !isNaN(parsed.getTime()) ? parsed : new Date()
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Parse "DD-MM-YYYY" to Date object
  function parseDateString(str: string): Date | null {
    if (!str) return null
    const parts = str.split("-")
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // 0-indexed
    const year = parseInt(parts[2], 10)
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    return new Date(year, month, day)
  }

  // Format Date object to "DD-MM-YYYY"
  function formatDateString(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Sync viewDate when value changes from parent/input
  useEffect(() => {
    const parsed = parseDateString(value)
    if (parsed && !isNaN(parsed.getTime())) {
      setViewDate(parsed)
    }
  }, [value])

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Input typing handler: automatically format as typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9-]/g, "") // Allow digits and dashes

    // Auto insert dashes as user types DD-MM-YYYY
    if (val.length === 2 && !val.includes("-") && e.nativeEvent.constructor.name === "InputEvent") {
      val = val + "-"
    } else if (val.length === 5 && val.split("-").length === 2 && e.nativeEvent.constructor.name === "InputEvent") {
      val = val + "-"
    }

    // Limit length to 10
    if (val.length <= 10) {
      onChange(val)
    }
  }

  // Calendar calculations
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const prevMonthDays = new Date(year, month, 0).getDate()

  const selectDate = (day: number) => {
    const selected = new Date(year, month, day)
    onChange(formatDateString(selected))
    setIsOpen(false)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(new Date(year, month + (direction === "prev" ? -1 : 1), 1))
  }

  const selectedDateObj = parseDateString(value)
  const isSelected = (day: number) => {
    if (!selectedDateObj) return false
    return (
      selectedDateObj.getDate() === day &&
      selectedDateObj.getMonth() === month &&
      selectedDateObj.getFullYear() === year
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  // Render Day Cells
  const renderDays = () => {
    const cells = []

    // Previous month leading days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i
      cells.push(
        <button
          key={`prev-${d}`}
          type="button"
          disabled
          className="h-8 w-8 text-xs text-[#A9A9A9] opacity-40 font-sans cursor-default"
        >
          {d}
        </button>
      )
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const selected = isSelected(d)
      const currentToday = isToday(d)

      cells.push(
        <button
          key={`curr-${d}`}
          type="button"
          onClick={() => selectDate(d)}
          className={cn(
            "h-8 w-8 text-sm font-medium rounded-full font-sans transition-all flex items-center justify-center cursor-pointer active:scale-90",
            selected
              ? "bg-[#303030] text-white font-semibold"
              : currentToday
                ? "border border-[#FF5623] text-[#FF5623] font-semibold hover:bg-[#FF5623]/5"
                : "text-[#303030] hover:bg-gray-100"
          )}
        >
          {d}
        </button>
      )
    }

    // Next month trailing days to complete row grid (multiple of 7)
    const totalCells = cells.length
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let d = 1; d <= remaining; d++) {
      cells.push(
        <button
          key={`next-${d}`}
          type="button"
          disabled
          className="h-8 w-8 text-xs text-[#A9A9A9] opacity-40 font-sans cursor-default"
        >
          {d}
        </button>
      )
    }

    return cells
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full h-12 pl-4 pr-12 rounded-full border border-[#D9D9D9] focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030] placeholder-[#A9A9A9]"
      />
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
      >
        <CalendarPlus className="h-5 w-5 text-[#5E5E5E]" />
      </Button>

      {/* Floating Calendar Dropdown */}
      {isOpen && (
        <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2 z-50 w-[280px] p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-[#303030] cursor-pointer active:scale-95 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-heading text-sm font-bold text-[#303030] select-none">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-[#303030] cursor-pointer active:scale-95 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday grid */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-xs font-semibold text-[#5E5E5E] font-sans select-none">
                {day}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center justify-items-center">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "./button"

interface StepperProps {
  value: number
  onChange: (newValue: number) => void
  min?: number
  max?: number
}

export function Stepper({ value, onChange, min = 0, max = Infinity }: StepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="flex h-[44px] w-full max-w-[120px] min-w-0 items-center justify-between rounded-full bg-white px-1.5 transition-all select-none sm:h-[46px] sm:px-2.5">
      <Button
        type="button"
        variant="ghost"
        disabled={value <= min}
        onClick={handleDecrement}
        className="h-8 w-8 shrink-0 rounded-full p-0 text-[#C2C2C2] transition-all hover:bg-gray-50 hover:text-[#5E5E5E] active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        aria-label="Decrement"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </Button>

      <span className="min-w-5 flex-1 text-center font-heading text-base text-[#303030]">
        {value}
      </span>

      <Button
        type="button"
        variant="ghost"
        disabled={value >= max}
        onClick={handleIncrement}
        className="h-8 w-8 shrink-0 rounded-full p-0 text-[#C2C2C2] transition-all hover:bg-gray-50 hover:text-[#5E5E5E] active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        aria-label="Increment"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </div>
  )
}

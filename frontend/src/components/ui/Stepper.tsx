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
    <div className="flex items-center justify-between w-[120px] h-[46px] bg-white rounded-full px-2.5 transition-all select-none">
      {/* Decrement Button */}
      <Button
        type="button"
        variant="ghost"
        disabled={value <= min}
        onClick={handleDecrement}
        className="h-8 w-8 p-0 rounded-full hover:bg-gray-50 active:scale-90 text-[#C2C2C2] hover:text-[#5E5E5E] transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
        aria-label="Decrement"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </Button>

      {/* Value Display */}
      <span className="flex-1 text-center font-heading text-base text-[#303030]">
        {value}
      </span>

      {/* Increment Button */}
      <Button
        type="button"
        variant="ghost"
        disabled={value >= max}
        onClick={handleIncrement}
        className="h-8 w-8 p-0 rounded-full hover:bg-gray-50 active:scale-90 text-[#C2C2C2] hover:text-[#5E5E5E] transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
        aria-label="Increment"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </div>
  )
}

import { ChevronDown, X } from "lucide-react"
import { Button } from "./ui/button"
import { Stepper } from "./ui/Stepper"

export interface QuestionType {
  id: string
  label: string
  numQuestions: number
  marks: number
}

interface QuestionTypeRowProps {
  questionType: QuestionType
  options: string[]
  onChangeLabel: (label: string) => void
  onUpdateValue: (field: "numQuestions" | "marks", newValue: number) => void
  onRemove: () => void
}

export function QuestionTypeRow({
  questionType,
  options,
  onChangeLabel,
  onUpdateValue,
  onRemove,
}: QuestionTypeRowProps) {
  return (
    <div>
      {/* Desktop Row layout */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Dropdown */}
        <div className="relative flex-1">
          <select
            value={questionType.label}
            onChange={(e) => onChangeLabel(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-full border border-[#D9D9D9] appearance-none text-base font-sans text-[#303030] bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5E5E5E] pointer-events-none" />
        </div>

        {/* Remove button */}
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500 shrink-0 transition-colors active:scale-90"
          aria-label="Remove question type"
        >
          <X className="h-4 w-4 text-[#5E5E5E]" />
        </Button>

        {/* No. of Questions stepper */}
        <div className="flex items-center gap-1 w-[120px] justify-center">
          <Stepper
            value={questionType.numQuestions}
            onChange={(val) => onUpdateValue("numQuestions", val)}
            min={0}
          />
        </div>

        {/* Marks stepper */}
        <div className="flex items-center gap-1 w-[120px] justify-center">
          <Stepper
            value={questionType.marks}
            onChange={(val) => onUpdateValue("marks", val)}
            min={0}
          />
        </div>
      </div>

      {/* Mobile Card layout */}
      <div className="lg:hidden bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.01)] animate-in fade-in duration-200">
        {/* Top row: dropdown + remove button */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <select
              value={questionType.label}
              onChange={(e) => onChangeLabel(e.target.value)}
              className="w-full h-10 pl-3 pr-8 rounded-xl border border-[#D9D9D9] appearance-none text-sm font-sans text-[#303030] bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5E5E5E] pointer-events-none" />
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onRemove}
            className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500 shrink-0 transition-colors active:scale-90"
            aria-label="Remove question type"
          >
            <X className="h-4 w-4 text-[#5E5E5E]" />
          </Button>
        </div>

        {/* Bottom row: steppers side-by-side */}
        <div className="flex items-center gap-6">
          {/* No. of Questions */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs font-sans font-semibold text-[#5E5E5E] select-none">
              No. of Questions
            </span>
            <Stepper
              value={questionType.numQuestions}
              onChange={(val) => onUpdateValue("numQuestions", val)}
              min={0}
            />
          </div>

          {/* Marks */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs font-sans font-semibold text-[#5E5E5E] select-none">
              Marks
            </span>
            <Stepper
              value={questionType.marks}
              onChange={(val) => onUpdateValue("marks", val)}
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

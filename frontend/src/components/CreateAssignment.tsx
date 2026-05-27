import { useState } from "react"
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Mic,
} from "lucide-react"
import { Button } from "./ui/button"
import { FileUpload } from "./ui/FileUpload"
import { DatePicker } from "./ui/DatePicker"
import { QuestionTypeRow } from "./QuestionTypeRow"
import type { QuestionType } from "./QuestionTypeRow"
import type { Assignment } from "./FilledState"

const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False Questions",
  "Fill in the Blanks",
  "Match the Following",
]

const DEFAULT_QUESTION_TYPES: QuestionType[] = [
  { id: "1", label: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
  { id: "2", label: "Short Questions", numQuestions: 3, marks: 2 },
  { id: "3", label: "Diagram/Graph-Based Questions", numQuestions: 5, marks: 5 },
  { id: "4", label: "Numerical Problems", numQuestions: 5, marks: 5 },
]

interface CreateAssignmentProps {
  onBack: () => void
  onCreateAssignment: (assignment: Assignment) => void
}

export function CreateAssignment({ onBack, onCreateAssignment }: CreateAssignmentProps) {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(DEFAULT_QUESTION_TYPES)
  const [dueDate, setDueDate] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Computed totals
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.numQuestions, 0)
  const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.numQuestions * qt.marks, 0)

  // Handlers for question type rows
  const updateQuestionTypeValue = (id: string, field: "numQuestions" | "marks", newValue: number) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => {
        if (qt.id !== id) return qt
        return { ...qt, [field]: newValue }
      })
    )
  }

  const removeQuestionType = (id: string) => {
    setQuestionTypes((prev) => prev.filter((qt) => qt.id !== id))
  }

  const addQuestionType = () => {
    // Find first unused option
    const usedLabels = new Set(questionTypes.map((qt) => qt.label))
    const nextLabel = QUESTION_TYPE_OPTIONS.find((opt) => !usedLabels.has(opt))
    if (!nextLabel) return

    setQuestionTypes((prev) => [
      ...prev,
      { id: String(Date.now()), label: nextLabel, numQuestions: 1, marks: 1 },
    ])
  }

  const handleLabelChange = (id: string, newLabel: string) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => (qt.id === id ? { ...qt, label: newLabel } : qt))
    )
  }

  // Handle Form Submission
  const handleSubmit = () => {
    // Format today's date as DD-MM-YYYY
    const todayObj = new Date()
    const d = String(todayObj.getDate()).padStart(2, "0")
    const m = String(todayObj.getMonth() + 1).padStart(2, "0")
    const y = todayObj.getFullYear()
    const assignedDate = `${d}-${m}-${y}`

    // Derive a gorgeous title
    let title = "Custom Assignment"
    if (file) {
      // Remove file extension
      const baseName = file.name.replace(/\.[^/.]+$/, "")
      title = `${baseName} Assignment`
    } else if (questionTypes.length > 0) {
      title = `${questionTypes[0].label} Assignment`
    }

    const newAssignment: Assignment = {
      id: String(Date.now()),
      title,
      assignedDate,
      dueDate: dueDate || assignedDate, // Fallback if due date is empty
    }

    onCreateAssignment(newAssignment)
  }

  return (
    <section className="flex flex-1 flex-col px-4 lg:px-8 pb-10">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center gap-3 mt-4 mb-4">
        <span className="h-[12px] w-[12px] rounded-full bg-[#22C55E] shrink-0" />
        <div className="flex flex-col">
          <h1 className="font-heading text-[28px] font-bold leading-none text-[#303030]">
            Create Assignment
          </h1>
          <p className="font-sans text-base text-[#5E5E5E] mt-1.5 leading-none">
            Set up a new assignment for your students
          </p>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between mt-3 mb-4 relative">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 active:scale-95 p-0"
        >
          <ArrowLeft className="h-5 w-5 text-[#303030]" />
        </Button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-heading text-lg font-semibold text-[#303030] leading-none">
          Create Assignment
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-12 py-8">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-[4px] rounded-full bg-[#303030]" />
          <div className="flex-1 h-[4px] rounded-full bg-[#D9D9D9]" />
        </div>

        {/* Form Card */}
        <div className="bg-white/50 backdrop-blur-3xl border border-white/60 rounded-2xl p-5 lg:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.04)]">
          {/* Section Title */}
          <h2 className="font-heading text-xl lg:text-[22px] font-bold text-[#303030] leading-tight">
            Assignment Details
          </h2>
          <p className="font-sans text-sm text-[#5E5E5E] mt-1 leading-none">
            Basic information about your assignment
          </p>

          {/* File Upload Zone */}
          <FileUpload file={file} onChange={setFile} />

          {/* Due Date */}
          <div className="mt-6">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Due Date
            </label>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>

          {/* Question Type Section */}
          <div className="mt-6">
            {/* Desktop column headers */}
            <div className="hidden lg:flex items-center gap-4 mb-3">
              <span className="font-heading text-base font-bold text-[#303030] flex-1">
                Question Type
              </span>
              <span className="font-heading text-sm text-[#303030] w-[120px] text-center">
                No. of Questions
              </span>
              <span className="font-heading text-sm text-[#303030] w-[120px] text-center">
                Marks
              </span>
            </div>

            {/* Mobile label */}
            <span className="lg:hidden font-heading text-base font-bold text-[#303030] block mb-3">
              Question Type
            </span>

            {/* Question Type Rows */}
            <div className="flex flex-col gap-4">
              {questionTypes.map((qt) => (
                <QuestionTypeRow
                  key={qt.id}
                  questionType={qt}
                  options={QUESTION_TYPE_OPTIONS}
                  onChangeLabel={(label) => handleLabelChange(qt.id, label)}
                  onUpdateValue={(field, newVal) => updateQuestionTypeValue(qt.id, field, newVal)}
                  onRemove={() => removeQuestionType(qt.id)}
                />
              ))}
            </div>

            {/* Add Question Type */}
            <Button
              type="button"
              variant="ghost"
              onClick={addQuestionType}
              className=" mt-4 flex items-center gap-2 h-auto p-0 hover:bg-transparent text-[#303030]"
            >
              <span className="bg-[#2B2B2B] flex h-8 w-8 items-center justify-center rounded-full">
                <Plus className="h-4 w-4 text-[#FFFFFF]" />
              </span>
              <span className="font-heading text-sm font-semibold">
                Add Question Type
              </span>
            </Button>

            {/* Totals */}
            <div className="mt-4 flex flex-col items-end gap-0.5">
              <p className="font-heading text-sm font-medium text-[#303030]">
                Total Questions : {totalQuestions}
              </p>
              <p className="font-heading text-sm font-medium text-[#303030]">
                Total Marks : {totalMarks}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                className="w-full p-4 pr-12 rounded-2xl border border-[#D9D9D9] focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030] placeholder-[#A9A9A9] resize-none"
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-3 bottom-3 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <Mic className="h-5 w-5 text-[#5E5E5E]" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between mt-6 pb-4 lg:pb-0 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 h-[46px] px-6 rounded-full border-[#D9D9D9] text-[#303030] hover:bg-gray-50 font-heading font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 h-[46px] px-8 rounded-full bg-[#181818] text-white hover:bg-neutral-800 font-heading font-medium active:scale-98 transition-all"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

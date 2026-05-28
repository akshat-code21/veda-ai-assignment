import { useState } from "react"
import { z } from "zod"
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Mic,
  AlertCircle,
} from "lucide-react"
import { Button } from "./ui/button"
import { FileUpload } from "./ui/FileUpload"
import { DatePicker } from "./ui/DatePicker"
import { QuestionTypeRow } from "./QuestionTypeRow"
import type { QuestionType } from "./QuestionTypeRow"
import type { Assignment } from "@/types/assignment"

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

// Zod schema for assignment creation validation
const assignmentFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject is too long"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(z.object({
    id: z.string(),
    label: z.string(),
    numQuestions: z.number().int().min(1, "Must have at least 1 question"),
    marks: z.number().int().min(1, "Marks must be at least 1"),
  })).min(1, "At least one question type is required"),
  timeAllowed: z.string().optional(),
  additionalInstructions: z.string().optional(),
})

type FormErrors = Partial<Record<keyof z.infer<typeof assignmentFormSchema>, string>> & { general?: string }

interface CreateAssignmentProps {
  onBack: () => void
  onCreateAssignment: (assignment: Assignment, file?: File | null) => void
  onNext?: () => void
  submitting?: boolean
}

export function CreateAssignment({ onBack, onCreateAssignment, onNext, submitting }: CreateAssignmentProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(DEFAULT_QUESTION_TYPES)
  const [dueDate, setDueDate] = useState("")
  const [timeAllowed, setTimeAllowed] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.numQuestions, 0)
  const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.numQuestions * qt.marks, 0)

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const updateQuestionTypeValue = (id: string, field: "numQuestions" | "marks", newValue: number) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => {
        if (qt.id !== id) return qt
        return { ...qt, [field]: newValue }
      })
    )
    clearFieldError("questionTypes")
  }

  const removeQuestionType = (id: string) => {
    setQuestionTypes((prev) => prev.filter((qt) => qt.id !== id))
  }

  const addQuestionType = () => {
    const usedLabels = new Set(questionTypes.map((qt) => qt.label))
    const nextLabel = QUESTION_TYPE_OPTIONS.find((opt) => !usedLabels.has(opt))
    if (!nextLabel) return

    setQuestionTypes((prev) => [
      ...prev,
      { id: String(Date.now()), label: nextLabel, numQuestions: 1, marks: 1 },
    ])
    clearFieldError("questionTypes")
  }

  const handleLabelChange = (id: string, newLabel: string) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => (qt.id === id ? { ...qt, label: newLabel } : qt))
    )
  }

  const handleSubmit = () => {
    const result = assignmentFormSchema.safeParse({
      title,
      subject,
      dueDate,
      questionTypes,
      timeAllowed: timeAllowed || undefined,
      additionalInstructions: additionalInfo || undefined,
    })

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof FormErrors
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})

    const newAssignment = {
      _id: "",
      userId: "",
      title: result.data.title,
      subject: result.data.subject,
      assignedDate: new Date().toISOString(),
      dueDate: result.data.dueDate,
      questionTypes: questionTypes.map((qt) => ({
        label: qt.label,
        numQuestions: qt.numQuestions,
        marks: qt.marks,
      })),
      numberOfQuestions: totalQuestions,
      totalMarks,
      timeAllowed: result.data.timeAllowed,
      additionalInstructions: result.data.additionalInstructions,
      status: "pending" as const,
    }

    onCreateAssignment(newAssignment, file)
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <section className="flex flex-1 flex-col px-4 pb-8 lg:px-8 lg:pb-10">
      <div className="hidden lg:flex items-center gap-3 mt-4 mb-4">
        <span className="h-[12px] w-[12px] rounded-full bg-[#22C55E] shrink-0" />
        <div className="flex flex-col">
          <h1 className="font-heading text-[28px] font-bold leading-none text-[#303030]">
            Create Assignment
          </h1>
          <p className="font-sans text-base text-[#5E5E5E]/55 mt-1.5 leading-none">
            Set up a new assignment for your students
          </p>
        </div>
      </div>

      <div className="flex lg:hidden items-center justify-between mt-3 mb-4 relative">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/25 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 active:scale-95 p-0"
        >
          <ArrowLeft className="size-6 text-[#303030]" />
        </Button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-heading text-lg font-semibold text-[#303030] leading-none">
          Create Assignment
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-0 py-2 lg:px-12 lg:py-8">
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-[4px] rounded-full bg-[#303030]" />
          <div className="flex-1 h-[4px] rounded-full bg-[#D9D9D9]" />
        </div>

        {hasErrors && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="font-heading text-sm font-semibold text-red-600">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm font-sans text-red-500 space-y-0.5">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white/50 backdrop-blur-3xl border border-white/60 rounded-2xl p-5 lg:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.04)]">
          <h2 className="font-heading text-xl lg:text-[22px] font-bold text-[#303030] leading-tight">
            Assignment Details
          </h2>
          <p className="font-light! font-sans text-sm text-[#5E5E5E]/80 mt-1 leading-none">
            Basic information about your assignment
          </p>

          <div className="mt-5">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Assignment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearFieldError("title") }}
              placeholder="e.g. Chapter 5 - Forces & Motion Quiz"
              className={`w-full h-11 px-4 rounded-xl border ${errors.title ? "border-red-400 ring-1 ring-red-200" : "border-[#D9D9D9]"} focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030] placeholder-[#A9A9A9] transition-all`}
            />
            {errors.title && <p className="text-xs text-red-500 font-sans mt-1">{errors.title}</p>}
          </div>

          <div className="mt-4">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); clearFieldError("subject") }}
              placeholder="e.g. Physics, Mathematics, Biology"
              className={`w-full h-11 px-4 rounded-xl border ${errors.subject ? "border-red-400 ring-1 ring-red-200" : "border-[#D9D9D9]"} focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030] placeholder-[#A9A9A9] transition-all`}
            />
            {errors.subject && <p className="text-xs text-red-500 font-sans mt-1">{errors.subject}</p>}
          </div>

          <div className="mt-4">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Time Allowed
            </label>
            <input
              type="text"
              value={timeAllowed}
              onChange={(e) => { setTimeAllowed(e.target.value); clearFieldError("timeAllowed") }}
              placeholder="e.g. 60, 90, 120 (or '1 Hour', '1.5 Hours')"
              className={`w-full h-11 px-4 rounded-xl border ${errors.timeAllowed ? "border-red-400 ring-1 ring-red-200" : "border-[#D9D9D9]"} focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030] placeholder-[#A9A9A9] transition-all`}
            />
            {errors.timeAllowed && <p className="text-xs text-red-500 font-sans mt-1">{errors.timeAllowed}</p>}
          </div>

          <FileUpload file={file} onChange={setFile} />

          <div className="mt-6">
            <label className="font-heading text-base font-bold text-[#303030] block mb-2">
              Due Date
            </label>
            <div className={errors.dueDate ? "ring-1 ring-red-200 rounded-xl" : ""}>
              <DatePicker value={dueDate} onChange={(val) => { setDueDate(val); clearFieldError("dueDate") }} />
            </div>
            {errors.dueDate && <p className="text-xs text-red-500 font-sans mt-1">{errors.dueDate}</p>}
          </div>

          <div className="mt-6">
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

            <span className="lg:hidden font-heading text-base font-bold text-[#303030] block mb-3">
              Question Type
            </span>

            {errors.questionTypes && (
              <p className="text-xs text-red-500 font-sans mb-2">{errors.questionTypes}</p>
            )}

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

            <div className="mt-4 flex flex-col items-end gap-0.5">
              <p className="font-heading text-sm font-medium text-[#303030]">
                Total Questions : {totalQuestions}
              </p>
              <p className="font-heading text-sm font-medium text-[#303030]">
                Total Marks : {totalMarks}
              </p>
            </div>
          </div>

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
                className="w-full p-4 pr-12 rounded-2xl border border-[#D9D9D9] focus:outline-none focus:ring-1 focus:ring-black text-base font-sans text-[#303030]/60 placeholder-[#A9A9A9] resize-none"
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

        <div className="flex items-center justify-center lg:justify-between mt-6 pb-24 lg:pb-0 gap-4">
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
            onClick={onNext ?? handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 h-[46px] px-8 rounded-full bg-[#181818] text-white hover:bg-neutral-800 font-heading font-medium active:scale-98 transition-all disabled:opacity-60"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

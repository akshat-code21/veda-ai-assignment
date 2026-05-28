"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CreateAssignment } from "@/components/CreateAssignment"
import { assignmentApi } from "@/lib/api"
import { useAssignmentStore } from "@/store/useAssignmentStore"
import type { Assignment } from "@/types/assignment"

export default function CreateAssignmentPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const addAssignment = useAssignmentStore((state) => state.addAssignment)
  const [submitting, setSubmitting] = useState(false)

  const handleCreateAssignment = async (assignment: Assignment, file?: File | null) => {
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", assignment.title || "Custom Assignment")
      formData.append("subject", assignment.subject || "General")
      formData.append("dueDate", assignment.dueDate || new Date().toISOString())
      formData.append("assignedDate", assignment.assignedDate || new Date().toISOString())
      const questionTypesValue = typeof assignment.questionTypes === "string"
        ? assignment.questionTypes
        : JSON.stringify(assignment.questionTypes || [])
      formData.append("questionTypes", questionTypesValue)
      formData.append("numberOfQuestions", String(assignment.numberOfQuestions || 10))
      formData.append("totalMarks", String(assignment.totalMarks || 50))
      if (assignment.additionalInstructions) {
        formData.append("additionalInstructions", assignment.additionalInstructions)
      }
      if (assignment.timeAllowed) {
        formData.append("timeAllowed", assignment.timeAllowed)
      }
      if (file) {
        formData.append("source_file", file)
      }

      const created = await assignmentApi.create(formData)
      addAssignment(created)
      queryClient.invalidateQueries({ queryKey: ["assignments"] })
      toast.success("Assignment created! Generation will begin shortly.")
      router.push(`/assignments/${created._id}`)
    } catch (err) {
      console.error("Failed to create assignment:", err)
      toast.error("Failed to create assignment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CreateAssignment
      onBack={() => router.push("/assignments")}
      onCreateAssignment={handleCreateAssignment}
      submitting={submitting}
    />
  )
}

import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { CreateAssignment } from "@/components/CreateAssignment"
import { assignmentApi } from "@/lib/api"
import type { Assignment } from "@/types/assignment"

export function CreateAssignmentPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleCreateAssignment = async (assignment: Assignment, file?: File | null) => {
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", assignment.title || "Custom Assignment")
      formData.append("subject", assignment.subject || "General")
      formData.append("dueDate", assignment.dueDate || new Date().toISOString())
      formData.append("assignedDate", assignment.assignedDate || new Date().toISOString())
      formData.append("questionTypes", assignment.questionTypes || "mcq")
      formData.append("numberOfQuestions", String(assignment.numberOfQuestions || 10))
      formData.append("totalMarks", String(assignment.totalMarks || 50))
      if (assignment.additionalInstructions) {
        formData.append("additionalInstructions", assignment.additionalInstructions)
      }
      if (file) {
        formData.append("file", file)
      }

      await assignmentApi.create(formData)
      toast.success("Assignment created! Generation will begin shortly.")
      navigate("/assignments")
    } catch (err) {
      console.error("Failed to create assignment:", err)
      toast.error("Failed to create assignment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CreateAssignment
      onBack={() => navigate("/assignments")}
      onCreateAssignment={handleCreateAssignment}
      submitting={submitting}
    />
  )
}

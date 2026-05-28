"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FilledState } from "@/components/FilledState"
import { EmptyState } from "@/components/EmptyState"
import { useAssignmentStore } from "@/store/useAssignmentStore"
import { assignmentApi } from "@/lib/api"
import { toast } from "sonner"

export default function AssignmentsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const assignments = useAssignmentStore((state) => state.assignments)
  const setAssignments = useAssignmentStore((state) => state.setAssignments)
  const deleteAssignment = useAssignmentStore((state) => state.deleteAssignment)

  const { data, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: assignmentApi.list,
  })

  useEffect(() => {
    if (data) {
      setAssignments(data)
    }
  }, [data, setAssignments])

  const handleDeleteAssignment = async (id: string) => {
    try {
      await assignmentApi.delete(id)
      deleteAssignment(id)
      queryClient.invalidateQueries({ queryKey: ["assignments"] })
      toast.success("Assignment deleted successfully.")
    } catch (err) {
      console.error("Failed to delete assignment:", err)
      toast.error("Failed to delete assignment. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <section className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="font-heading text-sm font-semibold text-gray-500">Loading assignments...</p>
        </div>
      </section>
    )
  }

  if (assignments.length === 0) {
    return <EmptyState onCreateFirst={() => router.push("/assignments/create")} />
  }

  return (
    <FilledState
      assignments={assignments}
      onDeleteAssignment={handleDeleteAssignment}
      onAddAssignment={() => router.push("/assignments/create")}
    />
  )
}

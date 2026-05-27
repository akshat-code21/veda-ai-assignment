import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { FilledState } from "@/components/FilledState"
import { EmptyState } from "@/components/EmptyState"
import { useAssignmentStore } from "@/store/useAssignmentStore"
import { assignmentApi } from "@/lib/api"
import { useWebSocket } from "@/hooks/use-websocket"

export function AssignmentsPage() {
  const navigate = useNavigate()
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

  useWebSocket()

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
    return <EmptyState onCreateFirst={() => navigate("/assignments/create")} />
  }

  return (
    <FilledState
      assignments={assignments}
      onDeleteAssignment={deleteAssignment}
      onAddAssignment={() => navigate("/assignments/create")}
    />
  )
}

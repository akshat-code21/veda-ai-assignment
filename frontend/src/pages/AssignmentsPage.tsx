import { useNavigate } from "react-router"
import { FilledState } from "@/components/FilledState"
import { EmptyState } from "@/components/EmptyState"
import { useAssignmentStore } from "@/store/useAssignmentStore"

export function AssignmentsPage() {
  const navigate = useNavigate()
  const assignments = useAssignmentStore((state) => state.assignments)
  const deleteAssignment = useAssignmentStore((state) => state.deleteAssignment)
  const resetAssignments = useAssignmentStore((state) => state.resetAssignments)

  if (assignments.length === 0) {
    return <EmptyState onCreateFirst={resetAssignments} />
  }

  return (
    <FilledState
      assignments={assignments}
      onDeleteAssignment={deleteAssignment}
      onAddAssignment={() => navigate("/assignments/create")}
    />
  )
}

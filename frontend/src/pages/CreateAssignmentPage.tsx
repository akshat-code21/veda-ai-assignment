import { useNavigate } from "react-router"
import { CreateAssignment } from "@/components/CreateAssignment"
import { useAssignmentStore } from "@/store/useAssignmentStore"

export function CreateAssignmentPage() {
  const navigate = useNavigate()
  const addAssignment = useAssignmentStore((state) => state.addAssignment)

  return (
    <CreateAssignment
      onBack={() => navigate("/assignments")}
      onNext={() => navigate("/assignments/output")}
      onCreateAssignment={(assignment) => {
        addAssignment(assignment)
        navigate("/assignments")
      }}
    />
  )
}

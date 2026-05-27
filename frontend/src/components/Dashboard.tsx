import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { EmptyState } from "@/components/EmptyState"
import { BottomNav } from "@/components/BottomNav"
import { FilledState } from "@/components/FilledState"
import { CreateAssignment } from "@/components/CreateAssignment"
import { AssignmentOutput } from "@/components/AssignmentOutput"
import type { Assignment } from "@/components/FilledState"

type ViewState = "list" | "create" | "output"

const SAMPLE_PDF_URL =
  "https://d7fyggfoy4ifa.cloudfront.net/6a155fca7664bf9454dd642a.pdf"

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "1", title: "Quiz on Electricity", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "2", title: "Quiz on Magnetism & Currents", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "3", title: "Chemical Reactions & Kinetics", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "4", title: "Forces, Motion & Friction", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "5", title: "Light Waves & Reflections", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "6", title: "Photosynthesis & Plant Cells", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "7", title: "Cell Structure & Anatomy", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "8", title: "Periodic Table Quiz", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "9", title: "Acids, Bases & pH Scales", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
  { id: "10", title: "Sound Waves & Acoustics", assignedDate: "20-06-2025", dueDate: "21-06-2025" },
]

export function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS)
  const [currentView, setCurrentView] = useState<ViewState>("list")

  const handleNavigateToCreate = () => {
    setCurrentView("create")
  }

  const handleBackToList = () => {
    setCurrentView("list")
  }

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id))
  }

  const handleCreateFirstAssignment = () => {
    setAssignments(INITIAL_ASSIGNMENTS)
  }

  return (
    <div className="flex h-screen! overflow-hidden bg-[#CECECE] lg:bg-linear-to-b lg:from-[#EEEEEE] lg:to-[#DADADA]">
      <div className="hidden lg:block p-3 h-full shrink-0">
        <Sidebar
          assignmentsCount={assignments.length}
          onAddAssignment={handleNavigateToCreate}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto">
        <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3 shrink-0">
          <TopBar />
        </div>

        {currentView === "output" ? (
          <AssignmentOutput
            onBack={() => setCurrentView("create")}
            pdfUrl={SAMPLE_PDF_URL}
          />
        ) : currentView === "create" ? (
          <CreateAssignment
            onBack={handleBackToList}
            onNext={() => setCurrentView("output")}
            onCreateAssignment={(newAssignment) => {
              setAssignments((prev) => [newAssignment, ...prev])
              setCurrentView("list")
            }}
          />
        ) : assignments.length > 0 ? (
          <FilledState
            assignments={assignments}
            onDeleteAssignment={handleDeleteAssignment}
            onAddAssignment={handleNavigateToCreate}
          />
        ) : (
          <EmptyState onCreateFirst={handleCreateFirstAssignment} />
        )}

        {currentView !== "output" && <div className="h-40 lg:hidden" />}
      </div>

      {currentView !== "output" && (
        <BottomNav onAddAssignment={handleNavigateToCreate} />
      )}
    </div>
  )
}

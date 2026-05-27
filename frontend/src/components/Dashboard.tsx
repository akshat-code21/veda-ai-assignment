import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { EmptyState } from "@/components/EmptyState"
import { BottomNav } from "@/components/BottomNav"
import { FilledState } from "@/components/FilledState"
import { CreateAssignment } from "@/components/CreateAssignment"
import type { Assignment } from "@/components/FilledState"

type ViewState = "list" | "create"

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
    <div className="flex h-svh overflow-hidden bg-[#CECECE] lg:bg-linear-to-b lg:from-[#EEEEEE] lg:to-[#DADADA]">
      {/* Sidebar — Desktop only */}
      <div className="hidden lg:block p-3 h-full shrink-0">
        <Sidebar
          assignmentsCount={assignments.length}
          onAddAssignment={handleNavigateToCreate}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3">
          <TopBar />
        </div>

        {/* View Router */}
        {currentView === "create" ? (
          <CreateAssignment
            onBack={handleBackToList}
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

        {/* Bottom padding for mobile bottom nav */}
        <div className="h-40 lg:hidden" />
      </div>

      {/* Bottom Navigation — Mobile only */}
      <BottomNav onAddAssignment={handleNavigateToCreate} />
    </div>
  )
}

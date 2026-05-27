import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { EmptyState } from "@/components/EmptyState"
import { BottomNav } from "@/components/BottomNav"
import { FilledState } from "@/components/FilledState"
import type { Assignment } from "@/components/FilledState"

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

  const handleAddAssignment = () => {
    const nextId = String(Date.now())
    const topics = [
      "Quantum Mechanics Quiz",
      "Human Nervous System Test",
      "Ecosystems & Food Chains",
      "Heat Transfer & Thermodynamics",
      "Genetics & DNA Structure",
      "Astrophysics & Solar Systems",
      "Invertebrates & Classification",
      "Erosion & Plate Tectonics",
      "Organic Chemistry Basics",
    ]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]

    // Format date nicely (DD-MM-YYYY)
    const today = new Date()
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      return `${dd}-${mm}-${yyyy}`
    }

    const assignedDate = formatDate(today)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const dueDate = formatDate(tomorrow)

    const newAssignment: Assignment = {
      id: nextId,
      title: randomTopic,
      assignedDate,
      dueDate,
    }
    setAssignments((prev) => [newAssignment, ...prev])
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
          onAddAssignment={handleAddAssignment}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3">
          <TopBar />
        </div>

        {/* Dynamic empty/filled state */}
        {assignments.length > 0 ? (
          <FilledState
            assignments={assignments}
            onDeleteAssignment={handleDeleteAssignment}
            onAddAssignment={handleAddAssignment}
          />
        ) : (
          <EmptyState onCreateFirst={handleCreateFirstAssignment} />
        )}

        {/* Bottom padding for mobile bottom nav */}
        <div className="h-40 lg:hidden" />
      </div>

      {/* Bottom Navigation — Mobile only */}
      <BottomNav onAddAssignment={handleAddAssignment} />
    </div>
  )
}

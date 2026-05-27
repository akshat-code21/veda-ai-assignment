import { create } from "zustand"
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

interface AssignmentStore {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  deleteAssignment: (id: string) => void
  resetAssignments: () => void
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: INITIAL_ASSIGNMENTS,
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),
  deleteAssignment: (id) =>
    set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) })),
  resetAssignments: () => set({ assignments: INITIAL_ASSIGNMENTS }),
}))

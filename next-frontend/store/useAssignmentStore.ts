import { create } from "zustand"
import type { Assignment } from "@/types/assignment"

interface AssignmentStore {
  assignments: Assignment[]
  setAssignments: (assignments: Assignment[]) => void
  addAssignment: (assignment: Assignment) => void
  deleteAssignment: (id: string) => void
  updateAssignmentStatus: (id: string, status: Assignment["status"]) => void
  resetAssignments: () => void
  activeAssignment: Assignment | null
  setActiveAssignment: (assignment: Assignment | null) => void
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  activeAssignment: null,
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),
  deleteAssignment: (id) =>
    set((state) => ({ assignments: state.assignments.filter((a) => a._id !== id) })),
  updateAssignmentStatus: (id, status) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, status } : a
      ),
      activeAssignment:
        state.activeAssignment && state.activeAssignment._id === id
          ? { ...state.activeAssignment, status }
          : state.activeAssignment,
    })),

  resetAssignments: () => set({ assignments: [], activeAssignment: null }),

  setActiveAssignment: (assignment) => set({ activeAssignment: assignment }),
}))

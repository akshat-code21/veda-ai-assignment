import { useState, useEffect, useRef } from "react"
import {
  MoreVertical,
  Plus,
  Search,
  ChevronDown,
  ArrowLeft,
  Funnel
} from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"
import type { Assignment } from "@/types/assignment"
import { format } from "date-fns"


interface FilledStateProps {
  assignments: Assignment[]
  onDeleteAssignment: (id: string) => void
  onAddAssignment: () => void
}

export function FilledState({
  assignments,
  onDeleteAssignment,
  onAddAssignment,
}: FilledStateProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle clicking outside to close the dropdown menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <section className="flex flex-1 flex-col px-4 lg:pl-1 lg:pr-8 pb-10 relative">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center gap-3 mt-4 mb-6">
        {/* Green indicator dot */}
        <span className="h-[12px] w-[12px] rounded-full bg-[#22C55E] shrink-0" />
        <div className="flex flex-col">
          <h1 className="font-heading text-[28px] font-bold leading-none text-[#303030]">
            Assignments
          </h1>
          <p className="font-sans text-base text-[#5E5E5E]/55 mt-1.5 leading-none">
            Manage and create assignments for your classes.
          </p>
        </div>
      </div>

      {/* Mobile Header (Back button + Title) */}
      <div className="flex lg:hidden items-center justify-between mt-3 mb-6 relative">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            // Mock going back
          }}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/25 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 active:scale-95 p-0"
        >
          <ArrowLeft className="size-6 text-[#303030]" />
        </Button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-heading text-lg font-semibold text-[#303030] leading-none">
          Assignments
        </h1>
        {/* Empty div on right to keep title centered */}
        <div className="w-10" />
      </div>

      {/* Filter & Search Bar Card */}
      <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex flex-row items-center justify-between gap-4 mb-6">
        {/* Filter segment */}
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 h-auto group"
        >
          <Funnel className="h-[18px] w-[18px] text-[#A9A9A9] group-hover:text-[#303030]" />
          <span className="font-heading text-sm lg:text-base font-semibold text-[#A9A9A9] group-hover:text-[#303030]">
            <span className="hidden lg:inline">Filter By</span>
            <span className="inline lg:hidden">Filter</span>
          </span>
          <ChevronDown className="h-4 w-4 text-[#5E5E5E] group-hover:text-[#303030]" />
        </Button>

        {/* Search Input segment */}
        <div className="relative flex-1 max-w-[280px] lg:max-w-[340px] ">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A9A9A9] font-bold" />
          <input
            type="text"
            placeholder={window.innerWidth >= 1024 ? "Search Assignment" : "Search Name"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-[#000000]/20 w-full h-10 pl-10 pr-4 rounded-full border focus:outline-none focus:ring-1 focus:ring-black text-sm lg:text-base font-bold font-sans text-[#303030] placeholder-[#A9A9A9]"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 pb-20">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment._id}
            onClick={() => navigate(`/assignments/${assignment._id}`)}
            className="cursor-pointer relative bg-white rounded-2xl p-5 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between h-[134px] lg:h-[142px] overflow-visible"
          >
            {/* Title & Three-dots */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-lg lg:text-[20px] font-bold text-[#303030] leading-tight select-none">
                {assignment.title}
              </h3>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveMenuId(activeMenuId === assignment._id ? null : assignment._id)
                }}
              >
                <MoreVertical className="h-5 w-5 text-[#5E5E5E]" />
              </Button>
            </div>

            {/* Bottom Row - Meta Info */}
            <div className="flex items-center justify-between gap-4 text-sm font-sans leading-none mt-auto">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#303030]">Assigned on :</span>
                <span className="text-[#303030]/50">
                  {(() => {
                    if (!assignment.assignedDate) return ""
                    const d = new Date(assignment.assignedDate)
                    return isNaN(d.getTime()) ? String(assignment.assignedDate) : format(d, "dd-MM-yyyy")
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
                <span className="font-bold text-[#303030]">Due :</span>
                <span className="text-[#303030]/50">
                  {(() => {
                    if (!assignment.dueDate) return ""
                    const d = new Date(assignment.dueDate)
                    return isNaN(d.getTime()) ? String(assignment.dueDate) : format(d, "dd-MM-yyyy")
                  })()}
                </span>
              </div>
            </div>

            {/* Popover Dropdown Menu */}
            {activeMenuId === assignment._id && (
              <div
                ref={menuRef}
                className="absolute right-4 top-14 w-[160px] bg-white rounded-xl shadow-[0px_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full px-4 py-2 h-auto rounded-none text-left text-sm font-sans text-[#303030] hover:bg-[#F0F0F0] justify-start"
                  onClick={() => {
                    setActiveMenuId(null)
                    navigate(`/assignments/${assignment._id}`)
                  }}
                >
                  View Assignment
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full px-4 py-2 h-auto rounded-none text-left text-sm font-sans text-red-500 hover:bg-[#FFF1F0] hover:text-red-500 justify-start font-medium"
                  onClick={() => {
                    setActiveMenuId(null)
                    onDeleteAssignment(assignment._id)
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <p className="font-heading text-lg font-medium text-[#5E5E5E]">
              No assignments match "{searchQuery}"
            </p>
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-[#FF5623] font-semibold hover:underline hover:text-[#FF5623] hover:bg-transparent h-auto p-0"
            >
              Clear search query
            </Button>
          </div>
        )}
      </div>

      {/* Floating Fading Bottom Spacer & Button (Desktop only) */}
      <div className="hidden lg:flex sticky bottom-0 h-[100px] -mb-10 bg-linear-to-t from-gray-200/80 via-gray-100/20 to-transparent pointer-events-none items-end justify-center z-30">
        <Button
          type="button"
          onClick={onAddAssignment}
          className="relative pointer-events-auto mb-4 flex items-center justify-center gap-[10px] w-[214px] h-[46px] px-6 py-3 rounded-full text-white cursor-pointer shadow-[0px_16px_32px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#181818] hover:bg-neutral-800 border-none outline-none focus:outline-none"
          id="create-assignment-floating"
        >
          <Plus className="h-5 w-5 shrink-0" strokeWidth={2.5} />
          <span className="text-base font-medium font-sans">
            Create Assignment
          </span>
        </Button>
      </div>
    </section>
  )
}

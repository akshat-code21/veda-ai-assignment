import {
  Home,
  Calendar,
  FileText,
  Sparkles,
  Plus,
} from "lucide-react"
import { Link } from "react-router"
import { Button } from "./ui/button"

interface TabItem {
  label: string
  icon: React.ReactNode
  active?: boolean
}

const tabs: TabItem[] = [
  {
    label: "Home",
    icon: <Home className="h-[18px] w-[18px]" />,
  },
  {
    label: "Assignments",
    icon: <Calendar className="h-5 w-5" />,
    active: true,
  },
  {
    label: "Library",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "AI Toolkit",
    icon: <Sparkles className="h-5 w-5" />,
  },
]

interface BottomNavProps {
  onAddAssignment?: () => void
}

export function BottomNav({ onAddAssignment }: BottomNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-3 px-2.5 pb-5 pt-10 lg:hidden bg-gradient-to-t from-[#CECECE] via-[#CECECE]/95 to-transparent">
      {onAddAssignment && (
        <Button
          type="button"
          variant="ghost"
          onClick={onAddAssignment}
          aria-label="Create new assignment"
          id="mobile-fab-create"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-0 shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)] hover:scale-105 hover:bg-white/90 active:scale-95"
        >
          <Plus className="size-5 text-[#FF5623]" />
        </Button>
      )}

      {/* Tab Bar */}
      <nav
        className="flex w-full items-center justify-between rounded-3xl bg-[#181818] px-6 py-4 mt-4 shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)]"
        aria-label="Bottom navigation"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to="/assignments"
            className={`flex flex-col items-center gap-1 rounded-[26px] px-2 py-1.5 transition-colors ${tab.active
              ? ""
              : "bg-transparent"
              }`}
          >
            <span
              className={
                tab.active ? "text-white" : "text-white/25"
              }
            >
              {tab.icon}
            </span>
            <span
              className={`font-heading text-xs font-semibold leading-[17px] ${tab.active ? "text-white" : "text-white/25"
                }`}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

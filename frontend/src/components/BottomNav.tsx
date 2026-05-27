import {
  Home,
  Calendar,
  FileText,
  Sparkles,
  Plus,
} from "lucide-react"

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
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-3 px-2.5 pb-4 lg:hidden">
      {/* FAB Button */}
      <button
        type="button"
        onClick={onAddAssignment}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)] transition-transform hover:scale-105 active:scale-95"
        aria-label="Create new assignment"
        id="mobile-fab-create"
      >
        <Plus className="h-5 w-5 text-[#303030]" />
      </button>

      {/* Tab Bar */}
      <nav
        className="flex w-full items-center justify-between rounded-3xl bg-[#181818] px-6 py-2.5 shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)]"
        aria-label="Bottom navigation"
      >
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href="#"
            className={`flex flex-col items-center gap-1 rounded-[26px] px-2 py-1.5 transition-colors ${
              tab.active
                ? "bg-white/10"
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
              className={`font-heading text-xs font-semibold leading-[17px] ${
                tab.active ? "text-white" : "text-white/25"
              }`}
            >
              {tab.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  )
}

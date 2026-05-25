import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  Library,
  Settings,
  Plus,
} from "lucide-react"
import { Button } from "./ui/button"

interface NavItem {
  label: string
  icon: React.ReactNode
  active?: boolean
}

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    label: "My Groups",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Assignments",
    icon: <FileText className="h-5 w-5" />,
    active: true,
  },
  {
    label: "AI Teacher's Toolkit",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: "My Library",
    icon: <Library className="h-5 w-5" />,
  },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[304px] min-w-[304px] flex-col rounded-2xl bg-white shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)]">
      {/* Top section */}
      <div className="flex flex-1 flex-col px-7 pt-6 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="VedaAI Logo"
            className="h-10 w-10"
          />
          <span className="text-[28px] font-bold leading-5 text-[#303030]">
            VedaAI
          </span>
        </div>

        {/* Create Assignment Button */}
        <div className="mt-14">
          <Button
            type="button"
            className="relative flex w-[251px] h-[42px] items-center justify-between gap-[10px] px-[43px] py-[7px] text-white cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] outline-none border-none bg-transparent hover:bg-transparent"
            style={{
              background: 'linear-gradient(#272727, #272727) padding-box, linear-gradient(90deg, #FF7950 0%, #C0350A 100%) border-box',
              border: '4px solid transparent',
              borderRadius: '100px',
              boxShadow: '0px 32px 48px 0px rgba(255, 255, 255, 0.2), 0px 16px 48px 0px rgba(255, 255, 255, 0.12), inset 0px 0px 34.5px 0px rgba(255, 255, 255, 0.25), inset 0px -1px 3.5px 0px rgba(177, 177, 177, 0.6)',
            }}
            id="create-assignment-sidebar"
          >
            <span className="text-base font-medium leading-[28px] font-sans">
              Create Assignment
            </span>
            <Plus className="h-[17px] w-[18px] shrink-0" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-[56px] flex flex-col gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-colors ${item.active
                  ? "bg-[#F0F0F0] font-medium text-[#303030]"
                  : "text-[#5E5E5E]/80 hover:bg-[#F0F0F0]/50"
                }`}
            >
              <span className={item.active ? "text-[#303030]" : "text-[#5E5E5E]/80"}>
                {item.icon}
              </span>
              <span className="leading-[22px]">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 px-6 pb-6">
        {/* Settings */}
        <a
          href="#"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-base leading-[22px] text-[#5E5E5E]/80 transition-colors hover:bg-[#F0F0F0]/50"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </a>

        {/* User Profile Card */}
        <div className="flex items-center gap-2 rounded-2xl bg-[#F0F0F0] p-3">
          <img
            src="/images/avatar.svg"
            alt="School avatar"
            className="h-14 w-[59px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold leading-[22px] text-[#303030]">
              Delhi Public School
            </span>
            <span className="text-sm leading-5 text-[#5E5E5E]">
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

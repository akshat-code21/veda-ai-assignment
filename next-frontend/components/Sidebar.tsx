"use client"

import {
  LayoutGrid,
  FileText,
  Settings,
  Sparkles,
  Book,
  ChartPie,
} from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"

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
    icon: <img src="/images/group.svg" alt="My Groups" className="h-5 w-5" />,
  },
  {
    label: "Assignments",
    icon: <FileText className="h-5 w-5" />,
    active: true,
  },
  {
    label: "AI Teacher's Toolkit",
    icon: <Book className="h-5 w-5" />,
  },
  {
    label: "My Library",
    icon: <ChartPie className="h-5 w-5" />,
  },
]

interface SidebarProps {
  assignmentsCount?: number
}

export function Sidebar({ assignmentsCount = 0 }: SidebarProps) {
  const { data: session } = authClient.useSession()
  const userName = session?.user?.name || "User"
  return (
    <aside className="hidden lg:flex h-[calc(100svh-24px)] w-[304px] min-w-[304px] flex-col justify-between rounded-2xl bg-white shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col px-[27px] pt-6">
        <div className="flex items-center">
          <img
            src="/images/logo.svg"
            alt="VedaAI Logo"
            className="h-16 w-16 shrink-0 relative top-[8px]"
          />
          <span className="font-heading text-[28px] font-bold text-[#303030]">
            VedaAI
          </span>
        </div>

        <div className="mt-14">
          <Link href="/assignments/create">
            <Button
              type="button"
              className="relative flex w-[251px] h-[42px] items-center justify-center gap-[10px] px-[43px] py-[7px] text-white cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] outline-none border-none bg-transparent hover:bg-transparent"
              style={{
                background:
                  "linear-gradient(#272727, #272727) padding-box, linear-gradient(90deg, #FF5623 0%, #C0350A 100%) border-box",
                border: "4px solid transparent",
                borderRadius: "100px",
                boxShadow:
                  "0px 32px 48px 0px rgba(255, 255, 255, 0.2), 0px 16px 48px 0px rgba(255, 255, 255, 0.12), inset 0px 0px 34.5px 0px rgba(255, 255, 255, 0.25), inset 0px -1px 3.5px 0px rgba(177, 177, 177, 0.6)",
              }}
              id="create-assignment-sidebar"
            >
              <Sparkles className="h-[17px] w-[18px] shrink-0" />
              <span className="text-base font-medium leading-[28px] font-sans">
                Create Assignment
              </span>
            </Button>
          </Link>
        </div>

        <nav
          className="mt-14 flex flex-col gap-2"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href="/assignments"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base font-heading transition-colors ${item.active
                ? "bg-[#F0F0F0] font-medium text-[#303030]"
                : "text-[#5E5E5E]/80 hover:bg-[#F0F0F0]/50"
                }`}
            >
              <span
                className={
                  item.active ? "text-[#303030]" : "text-[#5E5E5E]/80"
                }
              >
                {item.icon}
              </span>
              <span className="leading-[22px]">{item.label}</span>
              {item.label === "Assignments" && assignmentsCount > 0 && (
                <span className="ml-auto bg-[#FF5623] text-white text-[12px] font-bold px-[8px] py-[2.5px] rounded-full shrink-0 select-none">
                  {assignmentsCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-6">
        <a
          href="#"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-base leading-[22px] font-heading text-[#5E5E5E]/80 transition-colors hover:bg-[#F0F0F0]/50"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </a>

        <div className="flex items-center gap-2 rounded-2xl bg-[#F0F0F0] p-3">
          <img
            src="/images/avatar.svg"
            alt="School avatar"
            className="h-14 w-[59px] rounded-full object-cover"
          />
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="font-heading text-base font-bold leading-[22px] text-[#303030] truncate">
              {userName}
            </span>
            <span className="font-heading text-sm leading-5 text-[#5E5E5E] truncate">
              {session?.user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

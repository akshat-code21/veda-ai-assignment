import { Bell, ChevronDown, LayoutGrid, Menu } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function TopBar() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const userName = session?.user?.name || "User"

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate("/login")
  }

  return (
    <header className="w-full">
      <div className="hidden lg:flex items-center justify-between rounded-2xl bg-white/75 px-6 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            aria-label="Go back"
            id="topbar-back-btn"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-gray-50 p-0 shadow-none"
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1L1 8M1 8L8 15M1 8H19"
                stroke="#303030"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          <div className="flex items-center gap-2 pl-2">
            <LayoutGrid className="h-5 w-5 text-[#A9A9A9]" />
            <span className="font-heading text-base font-semibold leading-[19px] text-[#A9A9A9]">
              Assignment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            aria-label="Notifications"
            id="topbar-notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#EBEBEB] p-0"
          >
            <Bell className="h-6 w-6 text-[#303030]" />
            <span className="absolute right-px top-px h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                id="topbar-user-menu"
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 h-auto hover:bg-gray-50/50 cursor-pointer shadow-none"
              >
                <img
                  src="/images/user-avatar.png"
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="font-heading text-base font-semibold leading-[19px] text-[#303030]">
                  {userName}
                </span>
                <ChevronDown className="h-6 w-6 text-[#303030]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 p-1">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg font-medium transition-colors duration-150"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex lg:hidden items-center justify-between rounded-2xl bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo-small.png"
            alt="VedaAI Logo"
            className="h-7 w-7"
          />
          <span className="font-heading text-xl font-bold leading-7 text-[#303030]">
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            aria-label="Notifications"
            id="mobile-notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#EBEBEB] p-0"
          >
            <Bell className="h-6 w-6 text-[#303030]" />
            <span className="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <img
            src="/images/user-avatar.png"
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label="Open menu"
                id="mobile-menu-btn"
                className="flex h-6 w-6 items-center justify-center p-0 cursor-pointer"
              >
                <Menu strokeWidth={3} className="size-5 text-[#303030]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 p-1">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg font-medium transition-colors duration-150"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

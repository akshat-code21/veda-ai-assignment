import { Bell, ChevronDown, LayoutGrid, Menu } from "lucide-react"

export function TopBar() {
  return (
    <header className="w-full">
      <div className="hidden lg:flex items-center justify-between rounded-2xl bg-white/75 px-6 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-50"
            aria-label="Go back"
            id="topbar-back-btn"
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
          </button>

          <div className="flex items-center gap-2 pl-2">
            <LayoutGrid className="h-5 w-5 text-[#A9A9A9]" />
            <span className="font-heading text-base font-semibold leading-[19px] text-[#A9A9A9]">
              Assignment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6] transition-colors hover:bg-[#EBEBEB]"
            aria-label="Notifications"
            id="topbar-notifications"
          >
            <Bell className="h-6 w-6 text-[#303030]" />
            <span className="absolute right-px top-px h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)] transition-colors hover:bg-gray-50/50"
            id="topbar-user-menu"
          >
            <img
              src="/images/user-avatar.png"
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-heading text-base font-semibold leading-[19px] text-[#303030]">
              John Doe
            </span>
            <ChevronDown className="h-6 w-6 text-[#303030]" />
          </button>
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
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]"
            aria-label="Notifications"
            id="mobile-notifications"
          >
            <Bell className="h-6 w-6 text-[#303030]" />
            <span className="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <img
            src="/images/user-avatar.png"
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
          />

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            aria-label="Open menu"
            id="mobile-menu-btn"
          >
            <Menu className="h-6 w-6 text-[#303030]" />
          </button>
        </div>
      </div>
    </header>
  )
}

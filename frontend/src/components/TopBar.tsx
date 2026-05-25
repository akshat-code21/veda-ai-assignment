import { Bell, ChevronDown, LayoutGrid, Menu } from "lucide-react"

export function TopBar() {
  return (
    <header className="w-full">
      {/* Desktop Top Bar */}
      <div className="hidden lg:flex items-center justify-between rounded-2xl bg-white/75 px-6 py-1.5 backdrop-blur-sm">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
            aria-label="Go back"
            id="topbar-back-btn"
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L1 8M1 8L8 15M1 8H19" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 pl-2">
            <LayoutGrid className="h-5 w-5 text-[#A9A9A9]" />
            <span className="text-base font-semibold leading-[19px] text-[#A9A9A9]">
              Assignment
            </span>
          </div>
        </div>

        {/* Right: Notification + User */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]"
            aria-label="Notifications"
            id="topbar-notifications"
          >
            <Bell className="h-5 w-5 text-[#303030]" />
            <span className="absolute right-1 top-0.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)]"
            id="topbar-user-menu"
          >
            <img
              src="/images/user-avatar.png"
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-base font-semibold leading-[19px] text-[#303030]">
              John Doe
            </span>
            <ChevronDown className="h-6 w-6 text-[#303030]" />
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="flex lg:hidden items-center justify-between rounded-2xl bg-white px-3 py-2.5">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/logo-small.png"
            alt="VedaAI Logo"
            className="h-7 w-7"
          />
          <span className="text-xl font-bold leading-7 text-[#303030]">
            VedaAI
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]"
            aria-label="Notifications"
            id="mobile-notifications"
          >
            <Bell className="h-6 w-6 text-[#303030]" />
            <span className="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Avatar */}
          <img
            src="/images/user-avatar.png"
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
          />

          {/* Hamburger Menu */}
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

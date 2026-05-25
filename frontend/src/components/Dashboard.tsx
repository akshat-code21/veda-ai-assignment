import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { EmptyState } from "@/components/EmptyState"
import { BottomNav } from "@/components/BottomNav"

export function Dashboard() {
  return (
    <div className="flex min-h-svh bg-[#CECECE] lg:bg-gradient-to-b lg:from-[#EEEEEE] lg:to-[#DADADA]">
      {/* Sidebar — Desktop only */}
      <div className="hidden lg:block p-3">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3">
          <TopBar />
        </div>

        {/* Empty State Content */}
        <EmptyState />

        {/* Bottom padding for mobile bottom nav */}
        <div className="h-36 lg:hidden" />
      </div>

      {/* Bottom Navigation — Mobile only */}
      <BottomNav />
    </div>
  )
}

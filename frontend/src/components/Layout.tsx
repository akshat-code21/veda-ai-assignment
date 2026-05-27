import { Outlet, useLocation, useNavigate } from "react-router"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { BottomNav } from "@/components/BottomNav"
import { useAssignmentStore } from "@/store/useAssignmentStore"

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const assignments = useAssignmentStore((state) => state.assignments)

  const isOutputPage = location.pathname.includes("/output")
  const isCreatePage = location.pathname.includes("/assignments/create")
  const showBottomNav = !isOutputPage

  return (
    <div className="flex h-screen! overflow-hidden bg-[#CECECE] lg:bg-linear-to-b lg:from-[#EEEEEE] lg:to-[#DADADA]">
      <div className="hidden lg:block p-3 h-full shrink-0">
        <Sidebar
          assignmentsCount={assignments.length}
          onAddAssignment={() => navigate("/assignments/create")}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto">
        <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3 shrink-0">
          <TopBar />
        </div>

        <Outlet />

        {showBottomNav && <div className="h-40 lg:hidden" />}
      </div>

      {showBottomNav && (
        <BottomNav
          onAddAssignment={
            isCreatePage ? undefined : () => navigate("/assignments/create")
          }
        />
      )}
    </div>
  )
}

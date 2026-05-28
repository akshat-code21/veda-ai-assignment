"use client"

import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { BottomNav } from "@/components/BottomNav"
import { useAssignmentStore } from "@/store/useAssignmentStore"
import { AuthGuard } from "@/components/AuthGuard"
import { useCallback } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const assignments = useAssignmentStore((state) => state.assignments)

  const isOutputPage = pathname.includes("/output")
  const isCreatePage = pathname.includes("/assignments/create")
  const showBottomNav = !isOutputPage

  const handleAddAssignment = useCallback(() => {
    router.push("/assignments/create")
  }, [router])

  return (
    <AuthGuard>
      <div className="flex h-screen! overflow-hidden bg-[#DBDBDB]">
        <div className="hidden lg:block p-3 h-full shrink-0">
          <Sidebar assignmentsCount={assignments.length} />
        </div>

        <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto">
          <div className="p-2.5 lg:px-0 lg:pt-3 lg:pr-3 shrink-0">
            <TopBar />
          </div>

          {children}

          {showBottomNav && <div className="h-40 lg:hidden" />}
        </div>

        {showBottomNav && (
          <BottomNav
            onAddAssignment={
              isCreatePage ? undefined : handleAddAssignment
            }
          />
        )}
      </div>
    </AuthGuard>
  )
}

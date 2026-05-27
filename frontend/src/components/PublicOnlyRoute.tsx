import { authClient } from "@/lib/auth-client";
import type { ReactElement } from "react";
import { Navigate } from "react-router";

export default function PublicOnlyRoute({ children }: {
    children: ReactElement
}) {
    const { data: session, isPending } = authClient.useSession()


    if (isPending) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                    <p className="font-heading text-sm font-semibold text-gray-500">Loading your session...</p>
                </div>
            </div>
        )
    }

    if (session) {
        return <Navigate to="/assignments" replace />
    }

    return children
}
import { useEffect, useState, useRef } from "react"
import { useAssignmentStore } from "@/store/useAssignmentStore"
import { api } from "@/lib/api"
import type { Assignment } from "@/types/assignment"

export function useWebSocket() {
    const assignments = useAssignmentStore((s) => s.assignments)
    const setAssignments = useAssignmentStore((s) => s.setAssignments)
    const updateAssignmentStatus = useAssignmentStore((s) => s.updateAssignmentStatus)

    const wsRef = useRef<WebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const reconnectTimeoutRef = useRef<number | null>(null)

    useEffect(() => {

        const wsUrl = import.meta.env.VITE_WS_URL

        function connect() {
            if (wsRef.current) return

            const ws = new WebSocket(wsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                console.log("WebSocket connected")
                setConnected(true)
                setError(null)
            }

            ws.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("WebSocket message received:", data)

                    if (data.type === "assignment_updated" || data.type?.startsWith("assignment:")) {
                        const assignmentId = data.assignmentId || data.payload?.assignmentId

                        if (assignmentId) {
                            try {
                                const response = await api.get<Assignment>(`/api/assignments/${assignmentId}`)
                                const updatedAssignment = response.data

                                // Update assignments list in store
                                const exists = assignments.some((a) => a._id === assignmentId)
                                if (exists) {
                                    setAssignments(
                                        assignments.map((a) => (a._id === assignmentId ? updatedAssignment : a))
                                    )
                                } else {
                                    setAssignments([updatedAssignment, ...assignments])
                                }
                            } catch (err) {
                                console.error("Failed to fetch updated assignment:", err)
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error parsing WebSocket message:", e)
                }
            }

            ws.onerror = (err) => {
                console.error("WebSocket error:", err)
                setError(new Error("WebSocket connection failed"))
            }

            ws.onclose = (event) => {
                console.log("WebSocket disconnected:", event.code, event.reason)
                setConnected(false)
                wsRef.current = null

                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting WebSocket reconnect...")
                    connect()
                }, 3000)
            }
        }

        connect()

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
        }
    }, [assignments, setAssignments, updateAssignmentStatus])

    return { connected, error, ws: wsRef.current }
}
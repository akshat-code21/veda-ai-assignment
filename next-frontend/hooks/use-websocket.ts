"use client"

import { useEffect, useRef, useCallback } from "react"
import { authClient } from "@/lib/auth-client"

interface UseWebSocketOptions {
    assignmentId: string
    enabled?: boolean
    onStatusChange?: (status: string, payload: Record<string, any>) => void
}

export function useWebSocket({ assignmentId, enabled = true, onStatusChange }: UseWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onStatusChangeRef = useRef(onStatusChange)
    onStatusChangeRef.current = onStatusChange

    const cleanup = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
        }
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!enabled || !assignmentId) {
            cleanup()
            return
        }

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL

        async function connect() {
            if (wsRef.current) return

            const session = await authClient.getSession()
            const token = session.data?.session?.token
            if (!token) {
                console.error("No session token available for WebSocket")
                return
            }

            const ws = new WebSocket(`${wsUrl}?token=${token}`)
            wsRef.current = ws

            ws.onopen = () => {
                console.log(`[WS] Connected for assignment ${assignmentId}`)
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.payload?.assignmentId === assignmentId) {
                        console.log(`[WS] Event for ${assignmentId}:`, data.type)
                        onStatusChangeRef.current?.(data.type, data.payload)
                    }
                } catch (e) {
                    console.error("[WS] Error parsing message:", e)
                }
            }

            ws.onerror = () => {
                console.error("[WS] Connection error")
            }

            ws.onclose = (event) => {
                wsRef.current = null

                if (event.code === 1011 || event.code === 1008) {
                    console.error(`[WS] Auth failed (${event.code}): ${event.reason}`)
                    return
                }

                if (enabled) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect()
                    }, 5000)
                }
            }
        }

        connect()

        return cleanup
    }, [assignmentId, enabled, cleanup])
}

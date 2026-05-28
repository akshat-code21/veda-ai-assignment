import axios from "axios"
import type { Assignment } from "@/types/assignment"

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://veda-ai-assignment-8oph.onrender.com",
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export const assignmentApi = {
    list: () => api.get<Assignment[]>("/api/assignments").then((res) => res.data),
    get: (id: string) => api.get<Assignment>(`/api/assignments/${id}`).then((res) => res.data),
    create: (data: FormData) => api.post<Assignment>("/api/assignments", data).then((res) => res.data),
    regenerate: (id: string) => api.post(`/api/assignments/${id}/regenerate`).then((res) => res.data),
    delete: (id: string) => api.delete<{ message: string }>(`/api/assignments/${id}`).then((res) => res.data),
}

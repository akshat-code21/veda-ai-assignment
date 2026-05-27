import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { AssignmentsPage } from "@/pages/AssignmentsPage"
import { CreateAssignmentPage } from "@/pages/CreateAssignmentPage"
import { AssignmentOutputPage } from "@/pages/AssignmentOutputPage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicOnlyRoute from "./components/PublicOnlyRoute"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="/assignments" replace />} />
          <Route path="assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
          <Route path="assignments/create" element={<ProtectedRoute><CreateAssignmentPage /></ProtectedRoute>} />
          <Route path="assignments/:id" element={<ProtectedRoute><AssignmentOutputPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/assignments" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

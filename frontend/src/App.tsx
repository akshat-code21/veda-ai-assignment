import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { AssignmentsPage } from "@/pages/AssignmentsPage"
import { CreateAssignmentPage } from "@/pages/CreateAssignmentPage"
import { AssignmentOutputPage } from "@/pages/AssignmentOutputPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/assignments" replace />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="assignments/create" element={<CreateAssignmentPage />} />
          <Route path="assignments/output" element={<AssignmentOutputPage />} />
          <Route path="*" element={<Navigate to="/assignments" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

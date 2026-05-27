import { useNavigate } from "react-router"
import { AssignmentOutput } from "@/components/AssignmentOutput"

const SAMPLE_PDF_URL =
  "https://d7fyggfoy4ifa.cloudfront.net/6a155fca7664bf9454dd642a.pdf"

export function AssignmentOutputPage() {
  const navigate = useNavigate()

  return (
    <AssignmentOutput
      onBack={() => navigate("/assignments/create")}
      pdfUrl={SAMPLE_PDF_URL}
    />
  )
}

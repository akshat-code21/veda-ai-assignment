import { useNavigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { AssignmentOutput } from "@/components/AssignmentOutput"
import { assignmentApi } from "@/lib/api"

export function AssignmentOutputPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => assignmentApi.get(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === "pending" || status === "processing") return 3000
      return false
    },
  })

  const handleRegenerate = async () => {
    if (!id) return
    try {
      await assignmentApi.regenerate(id)
      toast.success("Regeneration started! This may take a moment...")
    } catch {
      toast.error("Failed to regenerate. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <section className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="font-heading text-sm font-semibold text-gray-500">Loading assignment...</p>
        </div>
      </section>
    )
  }

  if (error || !assignment) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="font-heading text-lg font-semibold text-red-500">
          Failed to load assignment
        </p>
        <button
          onClick={() => navigate("/assignments")}
          className="font-heading text-sm font-semibold text-[#303030] hover:underline cursor-pointer"
        >
          ← Back to assignments
        </button>
      </section>
    )
  }

  if (assignment.status === "pending" || assignment.status === "processing") {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <h2 className="font-heading text-xl font-bold text-[#303030]">
          {assignment.status === "pending" ? "Queued for generation..." : "Generating your paper..."}
        </h2>
        <p className="font-sans text-sm text-[#5E5E5E] text-center max-w-md">
          {assignment.status === "pending"
            ? "Your assignment is in the queue. Generation will start shortly."
            : "AI is crafting your question paper. This usually takes 30–60 seconds."}
        </p>
      </section>
    )
  }

  if (assignment.status === "failed") {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-[#303030]">Generation failed</h2>
        <p className="font-sans text-sm text-[#5E5E5E] text-center max-w-md">
          {assignment.errorMessage || "Something went wrong during paper generation."}
        </p>
        <button
          onClick={handleRegenerate}
          className="mt-2 h-[42px] px-6 rounded-full bg-[#181818] text-white font-heading font-medium text-sm hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate("/assignments")}
          className="font-heading text-sm font-semibold text-[#5E5E5E] hover:underline cursor-pointer"
        >
          ← Back to assignments
        </button>
      </section>
    )
  }

  // Status is "completed" — render the PDF viewer
  return (
    <AssignmentOutput
      onBack={() => navigate("/assignments")}
      pdfUrl={assignment.pdfUrl || ""}
      title={assignment.title}
      subject={assignment.subject}
      onRegenerate={handleRegenerate}
    />
  )
}

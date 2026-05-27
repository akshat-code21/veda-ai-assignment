import { Plus } from "lucide-react"
import { Button } from "./ui/button"

interface EmptyStateProps {
  onCreateFirst?: () => void
}

export function EmptyState({ onCreateFirst }: EmptyStateProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        {/* Illustration */}
        <img
          src="/images/illustration_empty.png"
          alt="No assignments illustration"
          className="h-[220px] w-[220px] lg:h-[300px] lg:w-[300px] object-contain"
        />

        {/* Text Content */}
        <div className="flex flex-col items-center gap-3 lg:gap-0.5">
          <h1 className="font-heading text-xl font-bold leading-7 text-[#303030]">
            No assignments yet
          </h1>
          <p className="max-w-[486px] text-center font-heading text-base leading-[22px] text-[#5E5E5E]/80">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let
            AI assist with grading.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        type="button"
        onClick={onCreateFirst}
        className="w-[277px] h-[46px] px-6 py-3 rounded-[48px] mt-8 flex flex-row items-center justify-center gap-1 text-white border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(#181818, #181818) padding-box, linear-gradient(90deg, #FFFFFF 0%, #666666 100%) border-box",
          border: "1.5px solid transparent",
          borderRadius: "48px",
        }}
        id="create-first-assignment"
      >
        <Plus className="h-5 w-5 shrink-0" strokeWidth={2} />
        <span className="font-heading text-base font-medium leading-[22px] text-center text-white">
          Create Your First Assignment
        </span>
      </Button>
    </section>
  )
}

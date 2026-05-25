import { Plus } from "lucide-react"
import { Button } from "./ui/button"

export function EmptyState() {
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
        <div className="flex flex-col items-center gap-0.5 lg:gap-0.5">
          <h1 className="text-xl font-bold leading-7 text-[#303030]">
            No assignments yet
          </h1>
          <p className="max-w-[486px] text-center text-base leading-[22px] text-[#5E5E5E]/80">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let
            AI assist with grading.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        type="button"
        className="w-[277px] h-[46px] px-[24px] py-[12px] rounded-[48px] mt-12 flex flex-row items-center justify-center text-white border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(#181818, #181818) padding-box, linear-gradient(90deg, #FFFFFF 0%, #666666 100%) border-box',
          border: '1.5px solid transparent',
          borderRadius: '48px',
        }}
        id="create-first-assignment"
      >
        <Plus className="h-5 w-5" strokeWidth="2" />
        <span className="ml-2 w-[205px] h-[22px] text-white text-base font-medium leading-[22px] text-center flex items-center justify-center font-heading">
          Create Your First Assignment
        </span>
      </Button>
    </section>
  )
}

"use client"

import dynamic from "next/dynamic"
import { Download, FilePlusCorner, RefreshCw } from "lucide-react"

const PDFViewer = dynamic(
  () => import("@embedpdf/react-pdf-viewer").then((mod) => mod.PDFViewer),
  { ssr: false }
)

import { ZoomMode } from "@embedpdf/react-pdf-viewer"

interface AssignmentOutputProps {
  onBack: () => void
  pdfUrl: string
  title?: string
  subject?: string
  onRegenerate?: () => void
}

const DISABLED_CATEGORIES = [
  "annotation",
  "annotation-shape",
  "form",
  "redaction",
  "document-open",
  "document-close",
  "document-print",
  "document-capture",
  "document-export",
  "document-fullscreen",
  "document-protect",
  "spread",
  "rotate",
  "tools",
  "pan",
  "pointer",
  "capture",
  "selection",
  "history",
  "insert",
  "panel-sidebar",
  "panel-comment",
]

export function AssignmentOutput({ onBack: _onBack, pdfUrl, title, subject, onRegenerate }: AssignmentOutputProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "assignment.pdf"
    link.target = "_blank"
    link.click()
  }

  const viewerConfig = {
    src: pdfUrl,
    theme: { preference: "light" as const },
    disabledCategories: DISABLED_CATEGORIES,
    zoom: {
      defaultZoomLevel: ZoomMode.FitWidth,
    },
  }

  const renderViewer = (height: string) => (
    <PDFViewer
      config={viewerConfig}
      style={{ width: "100%", height }}
    />
  )

  return (
    <section className="flex flex-col px-4 lg:pl-1 lg:pr-2 pb-10 ">
      <div className="hidden lg:flex flex-col pt-1">
        <div
          className="rounded-[32px] p-5 flex flex-col gap-3"
          style={{ backgroundColor: "#5E5E5E" }}
        >
          <div
            className="rounded-[32px] px-8 py-6 flex flex-col gap-4 shrink-0"
            style={{ backgroundColor: "rgba(24, 24, 24, 0.8)" }}
          >
            <p className="font-heading text-[20px] font-bold leading-[28px] text-white">
              {title && subject
                ? `Here is your generated question paper for ${subject}: ${title}`
                : "Here is your generated question paper:"}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 self-start h-[44px] px-6 rounded-full bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <FilePlusCorner className="h-5 w-5 text-[#303030]" />
                <span className="font-heading text-base font-medium text-[#303030] leading-[22px]">
                  Download as PDF
                </span>
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 self-start h-[44px] px-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-5 w-5 text-white" />
                  <span className="font-heading text-base font-medium text-white leading-[22px]">
                    Regenerate
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[32px] bg-white overflow-hidden" style={{ minHeight: "500px" }}>
            {renderViewer("100vh")}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:hidden px-0.5 pb-2">
        <div className="bg-white rounded-[40px] p-[9px] flex flex-col gap-[10px]">
          <div
            className="rounded-[32px] p-4 flex flex-col gap-3 shrink-0"
            style={{ backgroundColor: "#303030" }}
          >
            <p className="font-heading text-[14px] font-bold leading-[17px] text-[#F0F0F0]">
              {title && subject
                ? `${subject}: ${title}`
                : "Your generated question paper"}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 h-[36px] px-4 rounded-full bg-white text-[#303030] hover:bg-gray-100 transition-colors cursor-pointer text-xs font-semibold leading-none shrink-0"
              >
                <Download className="h-4 w-4 text-[#303030]" />
                Download PDF
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 h-[36px] px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer text-xs font-semibold leading-none shrink-0"
                >
                  <RefreshCw className="h-4 w-4 text-white" />
                  Regenerate
                </button>
              )}
            </div>
          </div>

          <div
            className="rounded-[32px] overflow-hidden"
            style={{ backgroundColor: "#F6F6F6", minHeight: "300px" }}
          >
            {renderViewer("calc(100vh - 240px)")}
          </div>
        </div>
      </div>
    </section>
  )
}

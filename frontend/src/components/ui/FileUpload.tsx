import React, { useRef, useState } from "react"
import { CloudUpload, X, FileText, CheckCircle } from "lucide-react"
import { Button } from "./button"

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
}

export function FileUpload({ file, onChange }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    // Check type: JPEG or PNG
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(selectedFile.type)) {
      setError("Only JPEG and PNG files are supported.")
      return
    }

    // Check size: max 10MB
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (selectedFile.size > maxSize) {
      setError("File size exceeds 10MB limit.")
      return
    }

    onChange(selectedFile)

    // Generate image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the outer div's onClick
    fileInputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the outer div's onClick
    onChange(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 border-2 border-dashed rounded-2xl p-6 lg:p-10 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none ${isDragActive
          ? "border-[#FF7950] bg-[#FF7950]/5"
          : file
            ? "border-[#22C55E]/50 bg-white"
            : "border-[#D9D9D9] hover:border-[#A9A9A9] bg-white"
          }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            {previewUrl ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#D9D9D9] shadow-sm bg-white shrink-0">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <FileText className="h-10 w-10 text-[#5E5E5E]" />
            )}

            <div className="text-center w-full min-w-0">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#303030]">
                <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                <span className="truncate max-w-[240px]">{file.name}</span>
              </div>
              <p className="text-xs text-[#5E5E5E] mt-0.5">{formatFileSize(file.size)}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              className="mt-2 rounded-full px-5 h-8 text-xs font-semibold border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Remove File
            </Button>
          </div>
        ) : (
          <>
            <CloudUpload className={`h-8 w-8 transition-colors ${isDragActive ? "text-[#FF7950]" : "text-[#2b2b2b]"}`} />
            <p className="font-heading text-base font-medium text-[#303030] text-center">
              Choose a file or drag & drop it here
            </p>
            <p className="font-sans font-extralight text-sm text-[#A9A9A9] text-center">
              JPEG, PNG, up to 10MB
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleButtonClick}
              className="mt-3 h-[46px] px-12 rounded-full bg-[#F6F6F6] hover:bg-[#F6F6F6] text-[#2C2C2C] font-sans font-medium text-[15px] active:scale-95 transition-all select-none"
            >
              Browse Files
            </Button>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm font-sans font-medium text-red-500 mt-2 text-center">
          {error}
        </p>
      )}

      <p className="text-sm text-[#5E5E5E] mt-3 text-center font-sans">
        Upload images of your preferred document/image
      </p>
    </div>
  )
}

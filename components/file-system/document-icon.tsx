"use client"

import { FileText } from "lucide-react"

interface DocumentIconProps {
  name: string
  onClick: () => void
}

export default function DocumentIcon({ name, onClick }: DocumentIconProps) {
  return (
    <div
      className="flex flex-col items-center p-3 rounded-lg hover:bg-white/20 cursor-pointer transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
        <FileText className="w-12 h-12 text-white" />
      </div>
      <span className="text-white text-sm text-center font-medium max-w-20 truncate">{name}</span>
    </div>
  )
}

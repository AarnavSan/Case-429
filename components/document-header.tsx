"use client"

import type React from "react"

import { Package, Edit, Wand2 } from "lucide-react"

interface DocumentHeaderProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
}

export default function DocumentHeader({ onMouseDown, isDragging }: DocumentHeaderProps) {
  return (
    <div
      className="flex items-center justify-between p-4 border-b border-[#e5e5e5] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#ff5f57] rounded-full hover:bg-[#ff4136] transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 bg-[#ffbd2e] rounded-full hover:bg-[#ff9500] transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 bg-[#28ca42] rounded-full hover:bg-[#00d084] transition-colors cursor-pointer"></div>
        </div>
        <span className="text-[#5b5b5b] text-sm ml-4">Flora Jasmine - AI Summary</span>
      </div>
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-[#5b5b5b]" />
        <Edit className="w-5 h-5 text-[#5b5b5b]" />
        <Wand2 className="w-5 h-5 text-[#5b5b5b]" />
        <Wand2 className="w-5 h-5 text-[#5b5b5b]" />
      </div>
    </div>
  )
}

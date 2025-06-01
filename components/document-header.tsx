"use client"

import type React from "react"

import { Package, Edit, Wand2, Highlighter } from "lucide-react"

interface DocumentHeaderProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
  highlighterColor: "green" | "red" | "purple" | null
  onHighlighterColorSelect: (color: "green" | "red" | "purple" | null) => void
  gameMode?: boolean
}

export default function DocumentHeader({
  onMouseDown,
  isDragging,
  highlighterColor,
  onHighlighterColorSelect,
  gameMode = false,
}: DocumentHeaderProps) {
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
        <span className="text-[#5b5b5b] text-sm ml-4">Flora Jasmine - AI Summary {gameMode && "🔍"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-[#5b5b5b]" />
        <Edit className="w-5 h-5 text-[#5b5b5b]" />
        <Wand2 className="w-5 h-5 text-[#5b5b5b]" />

        {/* Highlighter Color Selector - Hidden in game mode */}
        {!gameMode && (
          <div className="flex items-center gap-1 ml-2">
            <Highlighter className="w-4 h-4 text-[#5b5b5b]" />
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHighlighterColorSelect(highlighterColor === "green" ? null : "green")
                }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  highlighterColor === "green"
                    ? "bg-green-400 border-green-600 scale-110"
                    : "bg-green-300 border-green-400 hover:scale-105"
                }`}
                title="Green Highlighter"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHighlighterColorSelect(highlighterColor === "red" ? null : "red")
                }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  highlighterColor === "red"
                    ? "bg-red-400 border-red-600 scale-110"
                    : "bg-red-300 border-red-400 hover:scale-105"
                }`}
                title="Red Highlighter"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHighlighterColorSelect(highlighterColor === "purple" ? null : "purple")
                }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  highlighterColor === "purple"
                    ? "bg-purple-400 border-purple-600 scale-110"
                    : "bg-purple-300 border-purple-400 hover:scale-105"
                }`}
                title="Purple Highlighter"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

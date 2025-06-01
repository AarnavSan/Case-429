"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import DocumentHeader from "./document-header"
import DocumentContent from "./document-content"
import { useWindowResize } from "../hooks/use-window-resize"
import ResizeHandles from "./windows/resize-handles"

interface DocumentWindowProps {
  verdictSelected?: boolean
  onEvidenceClick?: (evidenceFile: string) => void
}

export default function DocumentWindow({ verdictSelected = false, onEvidenceClick }: DocumentWindowProps) {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [highlighterColor, setHighlighterColor] = useState<"green" | "red" | "purple" | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const { size, isResizing, handleResizeStart, getCursorForHandle } = useWindowResize({
    initialSize: { width: 700, height: 600 },
    minSize: { width: 500, height: 400 },
    maxSize: { width: 1000, height: 800 },
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  const handleHighlighterColorSelect = (color: "green" | "red" | "purple" | null) => {
    if (verdictSelected) return // Disable highlighter in game mode
    setHighlighterColor(color)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0)
      const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 0)

      setWindowPosition({
        x: Math.max(-200, Math.min(newX, maxX + 200)),
        y: Math.max(-100, Math.min(newY, maxY + 100)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart])

  return (
    <div className="flex-1 flex justify-center items-start pt-12">
      <div
        ref={windowRef}
        className="bg-white rounded-lg shadow-2xl transition-transform duration-75 relative"
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <DocumentHeader
          onMouseDown={handleMouseDown}
          isDragging={isDragging}
          highlighterColor={highlighterColor}
          onHighlighterColorSelect={handleHighlighterColorSelect}
          gameMode={verdictSelected}
        />
        <DocumentContent
          highlighterColor={highlighterColor}
          height={size.height - 60}
          verdictSelected={verdictSelected}
          onEvidenceClick={onEvidenceClick}
        />
        <ResizeHandles onResizeStart={handleResizeStart} getCursorForHandle={getCursorForHandle} />
      </div>
    </div>
  )
}

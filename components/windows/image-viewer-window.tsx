"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useWindowResize } from "../../hooks/use-window-resize"
import ResizeHandles from "./resize-handles"

interface ImageViewerWindowProps {
  title: string
  imagePath: string
  onClose: () => void
}

export default function ImageViewerWindow({ title, imagePath, onClose }: ImageViewerWindowProps) {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const { size, isResizing, handleResizeStart, getCursorForHandle } = useWindowResize({
    initialSize: { width: 700, height: 600 },
    minSize: { width: 400, height: 300 },
    maxSize: { width: 1200, height: 900 },
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
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
    <div className="fixed inset-0 flex justify-center items-start pt-12 pointer-events-none z-50">
      <div
        ref={windowRef}
        className="bg-white rounded-lg shadow-2xl pointer-events-auto transition-transform duration-75 relative"
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {/* Window Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-[#e5e5e5] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-[#ff5f57] rounded-full hover:bg-[#ff4136] transition-colors cursor-pointer"
              />
              <div className="w-3 h-3 bg-[#ffbd2e] rounded-full hover:bg-[#ff9500] transition-colors cursor-pointer" />
              <div className="w-3 h-3 bg-[#28ca42] rounded-full hover:bg-[#00d084] transition-colors cursor-pointer" />
            </div>
            <span className="text-[#5b5b5b] text-sm ml-4">{title}</span>
          </div>
        </div>

        {/* Image Content */}
        <div
          className="p-6 flex justify-center items-center bg-gray-50 overflow-hidden"
          style={{ height: `${size.height - 60}px` }}
        >
          <img
            src={imagePath || "/placeholder.svg"}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
            }}
          />
        </div>
        <ResizeHandles onResizeStart={handleResizeStart} getCursorForHandle={getCursorForHandle} />
      </div>
    </div>
  )
}

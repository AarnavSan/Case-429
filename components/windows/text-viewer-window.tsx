"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useWindowResize } from "../../hooks/use-window-resize"
import ResizeHandles from "./resize-handles"

interface TextViewerWindowProps {
  title: string
  content: string
  onClose: () => void
}

export default function TextViewerWindow({ title, content, onClose }: TextViewerWindowProps) {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const { size, isResizing, handleResizeStart, getCursorForHandle } = useWindowResize({
    initialSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 300 },
    maxSize: { width: 1000, height: 800 },
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

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ height: `${size.height - 60}px` }}>
          <style jsx global>{`
            .document-content h1 {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 1rem;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 0.5rem;
            }
            
            .document-content h2 {
              font-size: 1.25rem;
              font-weight: bold;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              color: #444;
            }
            
            .document-content h3 {
              font-size: 1.1rem;
              font-weight: bold;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              color: #555;
            }
            
            .document-content p {
              margin-bottom: 1rem;
              line-height: 1.5;
            }
            
            .document-content ul, .document-content ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
            
            .document-content ul li, .document-content ol li {
              margin-bottom: 0.25rem;
              line-height: 1.5;
            }
            
            .document-content .document-metadata {
              background-color: #f5f5f5;
              padding: 0.75rem;
              border-radius: 0.25rem;
              margin-bottom: 1rem;
            }
            
            .document-content .document-metadata p {
              margin-bottom: 0.25rem;
            }
            
            .document-content .document-footer {
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #ddd;
              font-style: italic;
            }
            
            .document-content .qa-pair {
              margin-bottom: 1rem;
            }
            
            .document-content .question {
              font-weight: bold;
              color: #333;
            }
            
            .document-content .answer {
              margin-left: 1rem;
              color: #555;
            }
            
            .document-content .timeline-entry {
              margin-bottom: 1.5rem;
            }
            
            .document-content .financial-section {
              margin-bottom: 1.5rem;
            }
            
            .document-content .financial-table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .document-content .financial-table td {
              padding: 0.5rem;
              border-bottom: 1px solid #eee;
            }
            
            .document-content .financial-table td:first-child {
              font-weight: bold;
              width: 60%;
            }
            
            .document-content .highlight-red {
              background-color: rgba(255, 200, 200, 0.5);
              border-left: 3px solid #ff5555;
              padding-left: 0.5rem;
            }
            
            .document-content .highlight-yellow {
              background-color: rgba(255, 255, 200, 0.5);
              border-left: 3px solid #ffcc00;
              padding-left: 0.5rem;
            }
            
            .document-content .highlight-green {
              background-color: rgba(200, 255, 200, 0.5);
              border-left: 3px solid #55cc55;
              padding-left: 0.5rem;
            }
            
            .document-content .research-section {
              margin-bottom: 1.5rem;
            }
            
            .document-content .discrepancies {
              margin-top: 2rem;
              padding: 1rem;
              background-color: #f8f8f8;
              border-radius: 0.25rem;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <ResizeHandles onResizeStart={handleResizeStart} getCursorForHandle={getCursorForHandle} />
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import DocumentHeader from "./document-header"
import DocumentContent from "./document-content"

export default function DocumentWindow() {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

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

      // Constrain to viewport bounds
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
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transition-transform duration-75"
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        <DocumentHeader onMouseDown={handleMouseDown} isDragging={isDragging} />
        <DocumentContent />
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"

interface WindowSize {
  width: number
  height: number
}

interface ResizeHandle {
  type: "corner" | "edge"
  position: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w"
  cursor: string
}

interface UseWindowResizeProps {
  initialSize: WindowSize
  minSize?: WindowSize
  maxSize?: WindowSize
}

export function useWindowResize({ initialSize, minSize, maxSize }: UseWindowResizeProps) {
  const [size, setSize] = useState<WindowSize>(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)

  const minWidth = minSize?.width || 300
  const minHeight = minSize?.height || 200
  const maxWidth = maxSize?.width || window.innerWidth * 0.9
  const maxHeight = maxSize?.height || window.innerHeight * 0.9

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.preventDefault()
      e.stopPropagation()

      setIsResizing(true)
      setResizeHandle(handle)
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      }
    },
    [size],
  )

  const constrainSize = useCallback(
    (width: number, height: number): WindowSize => {
      return {
        width: Math.max(minWidth, Math.min(maxWidth, width)),
        height: Math.max(minHeight, Math.min(maxHeight, height)),
      }
    },
    [minWidth, minHeight, maxWidth, maxHeight],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle || !resizeStartRef.current) return

      const deltaX = e.clientX - resizeStartRef.current.x
      const deltaY = e.clientY - resizeStartRef.current.y
      const startWidth = resizeStartRef.current.width
      const startHeight = resizeStartRef.current.height

      let newWidth = startWidth
      let newHeight = startHeight

      // Handle different resize directions
      switch (resizeHandle) {
        case "se": // Southeast corner
          newWidth = startWidth + deltaX
          newHeight = startHeight + deltaY
          break
        case "sw": // Southwest corner
          newWidth = startWidth - deltaX
          newHeight = startHeight + deltaY
          break
        case "ne": // Northeast corner
          newWidth = startWidth + deltaX
          newHeight = startHeight - deltaY
          break
        case "nw": // Northwest corner
          newWidth = startWidth - deltaX
          newHeight = startHeight - deltaY
          break
        case "e": // East edge
          newWidth = startWidth + deltaX
          break
        case "w": // West edge
          newWidth = startWidth - deltaX
          break
        case "s": // South edge
          newHeight = startHeight + deltaY
          break
        case "n": // North edge
          newHeight = startHeight - deltaY
          break
      }

      const constrainedSize = constrainSize(newWidth, newHeight)
      setSize(constrainedSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      resizeStartRef.current = null
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = getCursorForHandle(resizeHandle || "")
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, resizeHandle, constrainSize])

  const getCursorForHandle = (handle: string): string => {
    const cursors: Record<string, string> = {
      nw: "nw-resize",
      ne: "ne-resize",
      sw: "sw-resize",
      se: "se-resize",
      n: "n-resize",
      s: "s-resize",
      e: "e-resize",
      w: "w-resize",
    }
    return cursors[handle] || "default"
  }

  const resizeHandles: ResizeHandle[] = [
    { type: "corner", position: "nw", cursor: "nw-resize" },
    { type: "corner", position: "ne", cursor: "ne-resize" },
    { type: "corner", position: "sw", cursor: "sw-resize" },
    { type: "corner", position: "se", cursor: "se-resize" },
    { type: "edge", position: "n", cursor: "n-resize" },
    { type: "edge", position: "s", cursor: "s-resize" },
    { type: "edge", position: "e", cursor: "e-resize" },
    { type: "edge", position: "w", cursor: "w-resize" },
  ]

  return {
    size,
    isResizing,
    handleResizeStart,
    resizeHandles,
    getCursorForHandle,
  }
}

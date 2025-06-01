"use client"

import type React from "react"

interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, handle: string) => void
  getCursorForHandle: (handle: string) => string
}

export default function ResizeHandles({ onResizeStart, getCursorForHandle }: ResizeHandlesProps) {
  return (
    <>
      {/* Corner handles */}
      <div
        className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
        style={{ cursor: getCursorForHandle("nw") }}
        onMouseDown={(e) => onResizeStart(e, "nw")}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
        style={{ cursor: getCursorForHandle("ne") }}
        onMouseDown={(e) => onResizeStart(e, "ne")}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
        style={{ cursor: getCursorForHandle("sw") }}
        onMouseDown={(e) => onResizeStart(e, "sw")}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
        style={{ cursor: getCursorForHandle("se") }}
        onMouseDown={(e) => onResizeStart(e, "se")}
      />

      {/* Edge handles */}
      <div
        className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
        style={{ cursor: getCursorForHandle("n") }}
        onMouseDown={(e) => onResizeStart(e, "n")}
      />
      <div
        className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
        style={{ cursor: getCursorForHandle("s") }}
        onMouseDown={(e) => onResizeStart(e, "s")}
      />
      <div
        className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
        style={{ cursor: getCursorForHandle("w") }}
        onMouseDown={(e) => onResizeStart(e, "w")}
      />
      <div
        className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
        style={{ cursor: getCursorForHandle("e") }}
        onMouseDown={(e) => onResizeStart(e, "e")}
      />

      {/* Visible resize handle in bottom-right corner (Mac style) */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{ cursor: getCursorForHandle("se") }}
        onMouseDown={(e) => onResizeStart(e, "se")}
      >
        <div className="absolute bottom-1 right-1 w-3 h-3">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
            <path d="M12 12L12 8L8 12L12 12Z" fill="currentColor" opacity="0.5" />
            <path d="M12 12L12 4L4 12L12 12Z" fill="currentColor" opacity="0.3" />
            <path d="M12 12L12 0L0 12L12 12Z" fill="currentColor" opacity="0.1" />
          </svg>
        </div>
      </div>
    </>
  )
}

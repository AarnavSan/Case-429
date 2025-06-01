"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { useWindowResize } from "../../hooks/use-window-resize"
import ResizeHandles from "./resize-handles"

interface AudioPlayerWindowProps {
  title: string
  audioPath: string
  onClose: () => void
}

export default function AudioPlayerWindow({ title, audioPath, onClose }: AudioPlayerWindowProps) {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const windowRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { size, isResizing, handleResizeStart, getCursorForHandle } = useWindowResize({
    initialSize: { width: 450, height: 350 },
    minSize: { width: 350, height: 250 },
    maxSize: { width: 600, height: 500 },
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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

        {/* Audio Player Content */}
        <div className="p-6 flex flex-col justify-center" style={{ height: `${size.height - 60}px` }}>
          <audio
            ref={audioRef}
            src={audioPath}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>

            <Volume2 className="w-5 h-5 text-gray-500" />
          </div>

          <div className="text-center text-gray-600">
            <p className="font-medium">{title}</p>
            <p className="text-sm">Audio Recording</p>
          </div>
        </div>
        <ResizeHandles onResizeStart={handleResizeStart} getCursorForHandle={getCursorForHandle} />
      </div>
    </div>
  )
}

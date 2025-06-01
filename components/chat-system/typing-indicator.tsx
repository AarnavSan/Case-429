"use client"

import { useState, useEffect } from "react"

export default function TypingIndicator() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/90 rounded-2xl p-4 max-w-[100px]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#263851] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">🕵️</span>
        </div>
        <span className="text-[#5b5b5b] text-sm font-medium">Sherlock is typing{dots}</span>
      </div>
    </div>
  )
}

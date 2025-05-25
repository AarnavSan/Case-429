"use client"

import { useState } from "react"
import MacOSMenuBar from "./components/macos-menu-bar"
import ChatPanel from "./components/chat-panel"
import DocumentWindow from "./components/document-window"
import ProfileCard from "./components/profile-card"

export default function DetectiveInterface() {
  const [verdict, setVerdict] = useState<"guilty" | "not-guilty" | null>(null)

  const handleVerdictSelect = (selectedVerdict: "guilty" | "not-guilty") => {
    setVerdict(selectedVerdict)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8d8d8] to-[#18375b] relative overflow-hidden">
      <MacOSMenuBar />

      <div className="flex h-[calc(100vh-24px)] p-6 gap-6">
        <ChatPanel verdict={verdict} onVerdictSelect={handleVerdictSelect} />
        <DocumentWindow />
        <ProfileCard />
      </div>
    </div>
  )
}

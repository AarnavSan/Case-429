"use client"

import { useState } from "react"
import MacOSMenuBar from "./components/macos-menu-bar"
import ChatController from "./components/chat-system/chat-controller"
import DocumentWindow from "./components/document-window"
import FileSystemPanel from "./components/file-system-panel"

export default function DetectiveInterface() {
  const [verdict, setVerdict] = useState<"guilty" | "not-guilty" | null>(null)
  const [highlightResults, setHighlightResults] = useState<{ correct: number; incorrect: number; total: number }>({
    correct: 0,
    incorrect: 0,
    total: 0,
  })

  const handleVerdictSelect = (selectedVerdict: string) => {
    setVerdict(selectedVerdict as "guilty" | "not-guilty")
  }

  const handleHighlightAccuracyCheck = (results: { correct: number; incorrect: number; total: number }) => {
    setHighlightResults(results)
    console.log(`Highlight results: ${results.correct} correct, ${results.incorrect} incorrect out of ${results.total}`)

    // Pass the results to the chat controller
    const chatEngine = (window as any).chatEngine
    if (chatEngine) {
      chatEngine.setHighlightResults(results)
    }
  }

  const handleEvidenceClick = (evidenceFile: string) => {
    // This will be handled by the FileSystemPanel to open the evidence file
    console.log("Opening evidence file:", evidenceFile)
    // You can implement this to automatically open the corresponding file
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8d8d8] to-[#18375b] relative overflow-hidden">
      <MacOSMenuBar />

      <div className="flex h-[calc(100vh-24px)] p-6 gap-6">
        <ChatController onVerdictSelected={handleVerdictSelect} highlightResults={highlightResults} />
        <DocumentWindow
          verdictSelected={!!verdict}
          onEvidenceClick={handleEvidenceClick}
          onHighlightAccuracyCheck={handleHighlightAccuracyCheck}
        />
        <FileSystemPanel />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import ChatHeader from "./chat-header"
import ChatMessage from "./chat-message"
import VerdictButtons from "./verdict-buttons"
import ChatInput from "./chat-input"
import WatsonMessage from "./watson-message"

interface ChatPanelProps {
  verdict: "guilty" | "not-guilty" | null
  onVerdictSelect: (verdict: "guilty" | "not-guilty") => void
}

export default function ChatPanel({ verdict, onVerdictSelect }: ChatPanelProps) {
  const [showFullConversation, setShowFullConversation] = useState(false)

  // Handle verdict selection
  const handleVerdictSelect = (selectedVerdict: "guilty" | "not-guilty") => {
    onVerdictSelect(selectedVerdict)
    // Show the rest of the conversation after a short delay
    setTimeout(() => {
      setShowFullConversation(true)
    }, 1000)
  }

  const initialMessage =
    "Watson, the evidence against Flora Jasmine appears substantial, but I sense there are layers to this case we haven't yet uncovered. What's your assessment?"

  const verdictResponses = {
    guilty:
      "Interesting conclusion, Watson. While the evidence does point in that direction, I wonder if we're being led too easily to the obvious suspect. The removal from the will creates a compelling motive, but remember - timing can be coincidental.",
    "not-guilty":
      "A bold stance, Watson, given the circumstantial evidence. Yet your instincts may be correct - her defensive tone could be interpreted as fear rather than guilt. The timeline has several inconsistencies that trouble me.",
  }

  const followUpMessages = [
    "My dear Watson, observe the timeline carefully...",
    "The financial motive is clear, but consider the emotional state described in that voicemail.",
    "Elementary! The witness testimony troubles me. The housekeeper's account seems almost too convenient.",
    "What strikes you about the security footage? Notice the timestamp discrepancy?",
    "Precisely, my friend. In cases of this magnitude, we must separate emotion from evidence, speculation from fact.",
  ]

  return (
    <div className="w-80 flex flex-col">
      <ChatHeader />

      <div className="flex-1 bg-[#5b8bd8] p-4 space-y-4 overflow-y-auto">
        {/* Initial message from Sherlock */}
        <ChatMessage message={initialMessage} />

        {/* Show verdict buttons if no verdict selected yet */}
        {!verdict && <VerdictButtons onVerdictSelect={handleVerdictSelect} />}

        {/* Show Watson's response once verdict is selected */}
        {verdict && (
          <WatsonMessage
            message={
              verdict === "guilty" ? "I think they are guilty, Sherlock." : "I think they are not guilty, Sherlock."
            }
          />
        )}

        {/* Show Sherlock's response to the verdict */}
        {verdict && <ChatMessage message={verdictResponses[verdict]} />}

        {/* Show the rest of the conversation after verdict response */}
        {showFullConversation && (
          <>
            {followUpMessages.map((message, index) => (
              <ChatMessage key={index} message={message} maxWidth={index % 2 === 0 ? "max-w-[280px]" : undefined} />
            ))}

            <div className="flex justify-center pt-4">
              <div className="text-white text-2xl">•••</div>
            </div>
          </>
        )}
      </div>

      <ChatInput />
    </div>
  )
}

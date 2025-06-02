"use client"

import { useState, useEffect, useRef } from "react"
import ChatHeader from "../chat-header"
import ChatMessage from "../chat-message"
import WatsonMessage from "../watson-message"
import ChatInput from "../chat-input"
import TypingIndicator from "./typing-indicator"

interface Message {
  id: string
  type: "sherlock" | "watson" | "decision"
  content: string
  timestamp: number
}

interface Decision {
  id: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
}

interface ChatEngineProps {
  onDecisionMade?: (decision: string) => void
}

export default function ChatEngine({ onDecisionMade }: ChatEngineProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [messageQueue, setMessageQueue] = useState<string[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Process message queue
  useEffect(() => {
    if (messageQueue.length > 0 && !isProcessingQueue) {
      processNextMessage()
    }
  }, [messageQueue, isProcessingQueue])

  const processNextMessage = async () => {
    if (messageQueue.length === 0) return

    setIsProcessingQueue(true)
    setIsTyping(true)

    // Simulate typing delay (1-3 seconds based on message length)
    const nextMessage = messageQueue[0]
    const typingDelay = Math.max(1000, Math.min(3000, nextMessage.length * 50))

    await new Promise((resolve) => setTimeout(resolve, typingDelay))

    // Add the message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "sherlock",
      content: nextMessage,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])
    setIsTyping(false)
    setMessageQueue((prev) => prev.slice(1))

    // Brief pause between messages
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsProcessingQueue(false)
  }

  const pushMessages = (messageList: string[]) => {
    setMessageQueue((prev) => [...prev, ...messageList])
  }

  const pushDecision = (options: { label: string; value: string }[], onSelect: (value: string) => void) => {
    const decision: Decision = {
      id: `decision-${Date.now()}`,
      options,
      onSelect: (value: string) => {
        // Add Watson's response
        const watsonMessage: Message = {
          id: `watson-${Date.now()}`,
          type: "watson",
          content: options.find((opt) => opt.value === value)?.label || value,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, watsonMessage])
        setCurrentDecision(null)
        onSelect(value)
        // Don't call onDecisionMade here - let the specific handlers decide
      },
    }
    setCurrentDecision(decision)
  }

  // Expose functions to parent component
  useEffect(() => {
    // Attach functions to window for external access (temporary solution)
    ;(window as any).chatEngine = {
      pushMessages,
      pushDecision,
      setHighlightAccuracy: (accuracy: number) => {
        ;(window as any).chatEngine.highlightAccuracy = accuracy
      },
      highlightAccuracy: 0,
    }
  }, [])

  return (
    <div className="w-80 flex flex-col">
      <ChatHeader />

      <div className="flex-1 bg-[#5b8bd8] p-4 space-y-4 overflow-y-auto">
        {/* Render all messages */}
        {messages.map((message) => {
          if (message.type === "sherlock") {
            return <ChatMessage key={message.id} message={message.content} />
          } else if (message.type === "watson") {
            return <WatsonMessage key={message.id} message={message.content} />
          }
          return null
        })}

        {/* Show typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Show current decision */}
        {currentDecision && !isTyping && (
          <div className="flex justify-center gap-3">
            {currentDecision.options.map((option) => (
              <button
                key={option.value}
                onClick={() => currentDecision.onSelect(option.value)}
                className="px-6 py-2 rounded-full font-medium transition-all duration-200 bg-white/80 text-[#000000] hover:bg-blue-200 hover:scale-105"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />

        {/* Show conversation end indicator if no more messages */}
        {!isTyping && messageQueue.length === 0 && !currentDecision && messages.length > 0 && (
          <div className="flex justify-center pt-4">
            <div className="text-white text-2xl">•••</div>
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  )
}

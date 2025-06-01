"use client"

import { useEffect } from "react"
import ChatEngine from "./chat-engine"

interface ChatControllerProps {
  onVerdictSelected?: (verdict: string) => void
}

export default function ChatController({ onVerdictSelected }: ChatControllerProps) {
  useEffect(() => {
    // Initialize the conversation
    const startConversation = () => {
      const chatEngine = (window as any).chatEngine
      if (!chatEngine) {
        // Retry if chat engine not ready
        setTimeout(startConversation, 100)
        return
      }

      // Start with Sherlock's opening message
      chatEngine.pushMessages([
        "HEY WATSON! DID YOU LOOK AT THE NEWS?! Scotland Yard used the new AI tool trained on thousands of murder cases and accused Flora Jasmine for the murder of her step-father Sir Eric Harpe.",
        "But, I don't think she did it.",
        "I have it all figured out, but can YOU prove Scotland Yard wrong, Watson?",
      ])

      // After messages, show first decision
      setTimeout(() => {
        chatEngine.pushDecision(
          [{ label: "I am up for a challenge!", value: "challenge-accepted" }],
          (decision: string) => {
            handleFirstResponse(decision)
          },
        )
      }, 6000) // Wait for messages to finish
    }

    startConversation()
  }, [])

  const handleFirstResponse = (decision: string) => {
    const chatEngine = (window as any).chatEngine
    if (!chatEngine) return

    // Sherlock's response to accepting the challenge
    setTimeout(() => {
      chatEngine.pushMessages([
        "Amazing! Start by proving Flora's innocence to gain access to files on other suspects so we can also find the actual murderer.",
      ])

      // Show second decision
      setTimeout(() => {
        chatEngine.pushDecision([{ label: "Got it!", value: "understood" }], (decision: string) => {
          handleSecondResponse(decision)
        })
      }, 2000)
    }, 1000)
  }

  const handleSecondResponse = (decision: string) => {
    const chatEngine = (window as any).chatEngine
    if (!chatEngine) return

    // Sherlock's final explanation
    setTimeout(() => {
      chatEngine.pushMessages([
        "Here's the AI summary that the Scotland Yard looked at to accuse Flora. Go through it thoroughly. You can verify each piece of information by accessing its source.",
        'The source of information can be accessed if you hover and click on a sentence. There are 3 color highlighters which you can use to mark each line as "Accurate", "Misinformation" and "Hallucination".',
        "This way even I can track what you infer from the AI summary.",
        "When you're ready, let me know if you think Flora is actually guilty or if the evidence is not sufficient to convict her.",
      ])

      // Show final verdict decision
      setTimeout(() => {
        chatEngine.pushDecision(
          [
            { label: "Flora is guilty based on the evidence", value: "guilty" },
            { label: "The evidence is not sufficient to convict Flora", value: "not-guilty" },
          ],
          (decision: string) => {
            onVerdictSelected?.(decision)
            handleFinalVerdict(decision)
          },
        )
      }, 8000) // Wait for all explanation messages
    }, 1000)
  }

  const handleFinalVerdict = (verdict: string) => {
    const chatEngine = (window as any).chatEngine
    if (!chatEngine) return

    // Sherlock's response based on verdict
    const responses = {
      guilty: [
        "Hmm, Watson. While I understand the evidence appears compelling, I believe we must look deeper.",
        "The AI's analysis contains several concerning inconsistencies that suggest Flora may be innocent.",
        "Continue investigating the highlighted claims to uncover the truth.",
      ],
      "not-guilty": [
        "Excellent instincts, Watson! You're absolutely right to question this evidence.",
        "The AI's analysis contains several fabrications and misrepresentations that cast serious doubt on Flora's guilt.",
        "Now we must prove it by examining each claim carefully.",
      ],
    }

    setTimeout(() => {
      chatEngine.pushMessages(responses[verdict as keyof typeof responses])
    }, 1000)
  }

  return <ChatEngine onDecisionMade={onVerdictSelected} />
}

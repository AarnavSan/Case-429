"use client"

import { useEffect } from "react"
import ChatEngine from "./chat-engine"

interface ChatControllerProps {
  onVerdictSelected?: (verdict: string) => void
  highlightResults?: { correct: number; incorrect: number; total: number }
}

export default function ChatController({
  onVerdictSelected,
  highlightResults = { correct: 0, incorrect: 0, total: 0 },
}: ChatControllerProps) {
  useEffect(() => {
    // Initialize the conversation
    const startConversation = () => {
      const chatEngine = (window as any).chatEngine
      if (!chatEngine) {
        // Retry if chat engine not ready
        setTimeout(startConversation, 100)
        return
      }

      // Add method to set highlight results
      chatEngine.setHighlightResults = (results: { correct: number; incorrect: number; total: number }) => {
        // Store the results for later use
        chatEngine.highlightResults = results
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
            // ONLY call onVerdictSelected for the actual verdict choice
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

    // Wait a bit to ensure highlight results have been calculated
    setTimeout(() => {
      const results = chatEngine.highlightResults || { correct: 0, incorrect: 0, total: 0 }
      const allCorrect = results.incorrect === 0 && results.total > 0

      // Different responses based on verdict and highlight accuracy
      if (verdict === "not-guilty") {
        if (allCorrect) {
          chatEngine.pushMessages([
            `I told you so! You got ${results.correct} out of ${results.total} classifications correct - perfect score!`,
            "Here, you can access files on whoever you want now to find the actual killer.",
            "All the individuals involved in the case have AI summaries associated with them to help you save time. I think that thing does a decent job of extracting key information for the files.",
            "Also, I took a look at your highlights on the AI summary, good job on classifying those different pieces of information. Your attention to detail will come in handy for solving the case!",
          ])
        } else {
          chatEngine.pushMessages([
            `I told you so! However, you got ${results.correct} correct and ${results.incorrect} incorrect out of ${results.total} classifications.`,
            "Here, you can access files on whoever you want now to find the actual killer.",
            "All the individuals involved in the case have AI summaries associated with them to help you save time. I think that thing does a decent job of extracting key information for the files.",
            "However, before we jump onto solving the case, I took a look at your highlights on the AI summaries, and looks like you might have wrongly classified certain pieces of information.",
            "Here's a corrected sheet…review it to avoid future mistakes!",
          ])
        }
      } else {
        // guilty verdict
        if (allCorrect) {
          chatEngine.pushMessages([
            `My dear dear Watson, you got ${results.correct} out of ${results.total} classifications correct, but even after classifying all those pieces of information correctly and looking at all the facts and misrepresentations you don't think there's a lot of ambiguity involved?!`,
            "Take my word on this one and investigate the case further to find the real killer.",
          ])
        } else {
          chatEngine.pushMessages([
            `My dear dear Watson, you got ${results.correct} correct and ${results.incorrect} incorrect out of ${results.total} classifications.`,
            "Looks like your misclassification of the different pieces of information in the AI summary or accepting misrepresentations as facts led you to overlook a lot of ambiguity involved in this summary!",
            "Here's a corrected sheet…review it to avoid future mistakes!",
            "Now, take my word on this one and investigate the case further to find the real killer.",
          ])
        }
      }

      // After feedback, show next step option
      setTimeout(
        () => {
          chatEngine.pushDecision(
            [
              {
                label: "It's inconclusive that Flora is the murderer. I definitely need to dig deeper.",
                value: "dig-deeper",
              },
            ],
            (decision: string) => {
              handleDigDeeperResponse()
            },
          )
        },
        verdict === "not-guilty" ? 10000 : 8000,
      )
    }, 2000)
  }

  const handleDigDeeperResponse = () => {
    const chatEngine = (window as any).chatEngine
    if (!chatEngine) return

    chatEngine.pushMessages([
      "Excellent! Now you're thinking like a true detective.",
      "Let's examine the other suspects more closely. I've unlocked all the case files for you.",
      "Remember to apply the same critical thinking to all the AI summaries - they're not always reliable!",
    ])
  }

  // Don't pass onVerdictSelected to ChatEngine since we handle it manually
  return <ChatEngine />
}

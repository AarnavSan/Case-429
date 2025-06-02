"use client"

import { useState, useEffect } from "react"
import { useDatabase } from "../hooks/use-database"
import EvidenceViewerWindow from "./windows/evidence-viewer-window"

interface DocumentContentProps {
  highlighterColor: "green" | "red" | "purple" | null
  height?: number
  verdictSelected?: boolean
  onEvidenceClick?: (evidenceFile: string) => void
  onHighlightAccuracyCheck?: (results: { correct: number; incorrect: number; total: number }) => void
}

interface HighlightedSentence {
  id: string
  color: "green" | "red" | "purple"
  phraseNumber: number
}

interface EvidenceWindow {
  content: string
  title: string
  phraseNumber: number
}

export default function DocumentContent({
  highlighterColor,
  height = 400,
  verdictSelected = false,
  onEvidenceClick,
  onHighlightAccuracyCheck,
}: DocumentContentProps) {
  // Initialize with empty array - no example highlights
  const [highlightedSentences, setHighlightedSentences] = useState<HighlightedSentence[]>([])
  const [evidenceWindow, setEvidenceWindow] = useState<EvidenceWindow | null>(null)

  const [summaryContent, setSummaryContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { getSummaryEntry, database, loading: dbLoading, error: dbError } = useDatabase()

  // Track if we've already calculated accuracy to avoid multiple calls
  const [accuracyCalculated, setAccuracyCalculated] = useState(false)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetch("/assets/file-system/suspects/flora-jasmine/summary.html")
        if (!response.ok) {
          throw new Error("Failed to load summary")
        }
        const content = await response.text()
        setSummaryContent(content)
      } catch (error) {
        console.error("Error loading summary:", error)
        setSummaryContent("<p>Error loading summary content.</p>")
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  // Calculate highlight accuracy when verdict is selected
  useEffect(() => {
    if (verdictSelected && !accuracyCalculated && onHighlightAccuracyCheck && !dbLoading) {
      if (dbError) {
        console.error("Database error:", dbError)
        return
      }

      if (!database) {
        console.error("Database not loaded")
        return
      }

      // Get all phrases that have database entries
      const allPhrases = Array.from({ length: 19 }, (_, i) => i + 1)

      let correctCount = 0
      let incorrectCount = 0

      console.log("Calculating accuracy for phrases:", allPhrases)

      allPhrases.forEach((phraseNumber) => {
        const correctEntry = getSummaryEntry("Flora Jasmine", phraseNumber)

        if (correctEntry) {
          const userHighlight = highlightedSentences.find((h) => h.phraseNumber === phraseNumber)

          console.log(
            `Phrase ${phraseNumber}: correct=${correctEntry.type}, user=${userHighlight?.color || "unmarked"}`,
          )

          if (userHighlight) {
            // User marked this phrase
            if (userHighlight.color === correctEntry.type) {
              correctCount++
              console.log(`  ✓ Correct`)
            } else {
              incorrectCount++
              console.log(`  ✗ Incorrect`)
            }
          } else {
            // User didn't mark this phrase
            // Only count as incorrect if it's not a fact (facts can be left unmarked)
            if (correctEntry.type !== "green") {
              incorrectCount++
              console.log(`  ✗ Should have been marked as ${correctEntry.type}`)
            } else {
              correctCount++ // Facts can be left unmarked and still be correct
              console.log(`  ✓ Fact left unmarked (OK)`)
            }
          }
        } else {
          console.log(`Phrase ${phraseNumber}: No database entry found`)
        }
      })

      const total = correctCount + incorrectCount
      console.log(`Final results: ${correctCount} correct, ${incorrectCount} incorrect, ${total} total`)

      onHighlightAccuracyCheck({ correct: correctCount, incorrect: incorrectCount, total })
      setAccuracyCalculated(true)
    }
  }, [
    verdictSelected,
    highlightedSentences,
    getSummaryEntry,
    onHighlightAccuracyCheck,
    accuracyCalculated,
    database,
    dbLoading,
    dbError,
  ])

  // Function to load evidence file content
  const loadEvidenceFile = async (filePath: string): Promise<string> => {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`)
      }
      return await response.text()
    } catch (error) {
      console.error("Error loading evidence file:", error)
      return "<p>Error loading evidence content.</p>"
    }
  }

  // Handle categorization from evidence window
  const handleCategorize = (phraseNumber: number, category: "green" | "red" | "purple") => {
    const sentenceId = `sentence-${phraseNumber}`
    setHighlightedSentences((prev) => {
      const existing = prev.find((h) => h.id === sentenceId)
      if (existing) {
        if (existing.color === category) {
          return prev.filter((h) => h.id !== sentenceId)
        }
        return prev.map((h) => (h.id === sentenceId ? { ...h, color: category } : h))
      }
      return [...prev, { id: sentenceId, color: category, phraseNumber }]
    })
  }

  useEffect(() => {
    if (!summaryContent || loading) return

    const handleSummaryEntryClick = async (e: Event) => {
      const target = e.target as HTMLElement
      const analyzablePhrase = target.closest(".analyzable-phrase")
      if (!analyzablePhrase) return

      const phraseNumber = Number.parseInt(analyzablePhrase.getAttribute("data-phrase") || "0")
      if (!phraseNumber) return

      // Get the summary entry data
      const summaryEntryData = getSummaryEntry("Flora Jasmine", phraseNumber)

      if (verdictSelected) {
        // In investigation mode - check for evidence file
        if (summaryEntryData?.evidence_file && onEvidenceClick) {
          onEvidenceClick(summaryEntryData.evidence_file)
          return
        }
      } else {
        // In highlighting mode
        if (highlighterColor) {
          // If highlighter is active, apply highlight directly
          const sentenceId = `sentence-${phraseNumber}`
          setHighlightedSentences((prev) => {
            const existing = prev.find((h) => h.id === sentenceId)
            if (existing) {
              if (existing.color === highlighterColor) {
                return prev.filter((h) => h.id !== sentenceId)
              }
              return prev.map((h) => (h.id === sentenceId ? { ...h, color: highlighterColor, phraseNumber } : h))
            }
            return [...prev, { id: sentenceId, color: highlighterColor, phraseNumber }]
          })
        } else if (summaryEntryData?.evidence_file) {
          // If no highlighter is active but there's an evidence file, open evidence window
          try {
            const content = await loadEvidenceFile(summaryEntryData.evidence_file)
            const title = summaryEntryData.evidence_file.split("/").pop()?.replace(".html", "") || "Evidence"

            setEvidenceWindow({
              content,
              title: `Evidence: ${title}`,
              phraseNumber,
            })
          } catch (error) {
            console.error("Error opening evidence window:", error)
          }
        }
      }
    }

    // Add click listeners to all analyzable phrases
    const analyzablePhrases = document.querySelectorAll(".analyzable-phrase")
    analyzablePhrases.forEach((phrase) => {
      phrase.addEventListener("click", handleSummaryEntryClick)
    })

    return () => {
      analyzablePhrases.forEach((phrase) => {
        phrase.removeEventListener("click", handleSummaryEntryClick)
      })
    }
  }, [summaryContent, loading, verdictSelected, highlighterColor, onEvidenceClick, getSummaryEntry])

  useEffect(() => {
    if (!summaryContent || loading) return

    // Apply styling to analyzable phrases
    const analyzablePhrases = document.querySelectorAll(".analyzable-phrase")
    analyzablePhrases.forEach((phrase) => {
      const phraseNumber = Number.parseInt(phrase.getAttribute("data-phrase") || "0")
      if (!phraseNumber) return

      // Reset classes
      phrase.className = "analyzable-phrase"

      // Get the summary entry data
      const summaryEntryData = getSummaryEntry("Flora Jasmine", phraseNumber)

      // Add cursor style for evidence files
      if (summaryEntryData?.evidence_file) {
        phrase.classList.add("cursor-pointer")
        phrase.setAttribute("title", "Click to view evidence")
      }

      if (verdictSelected) {
        // Investigation mode - show both user highlights and correct answers
        const sentenceId = `sentence-${phraseNumber}`
        const userHighlight = highlightedSentences.find((h) => h.id === sentenceId)

        if (summaryEntryData) {
          let isCorrect = false

          if (userHighlight) {
            // User marked this phrase - check if correct
            isCorrect = userHighlight.color === summaryEntryData.type

            // Apply user's highlight background
            switch (userHighlight.color) {
              case "green":
                phrase.classList.add("bg-green-100")
                break
              case "red":
                phrase.classList.add("bg-red-100")
                break
              case "purple":
                phrase.classList.add("bg-purple-100")
                break
            }
          } else {
            // User didn't mark this phrase
            if (summaryEntryData.type !== "green") {
              // Should have been marked (not a fact) - show as incorrect
              isCorrect = false
            } else {
              // It's a fact and wasn't marked - that's okay
              isCorrect = true
            }
          }

          // Add border based on the CORRECT answer type (not user's choice)
          switch (summaryEntryData.type) {
            case "green":
              phrase.classList.add("border-l-4", "border-green-500", "px-2", "py-1", "rounded")
              break
            case "red":
              phrase.classList.add("border-l-4", "border-red-500", "px-2", "py-1", "rounded")
              break
            case "purple":
              phrase.classList.add("border-l-4", "border-purple-500", "px-2", "py-1", "rounded")
              break
          }

          // Add success/error ring
          if (isCorrect) {
            phrase.classList.add("ring-2", "ring-green-400")
            phrase.setAttribute("title", "✓ Correct analysis!")
          } else {
            phrase.classList.add("ring-2", "ring-red-400")
            if (userHighlight) {
              phrase.setAttribute(
                "title",
                `✗ You marked as ${userHighlight.color.toUpperCase()}, but correct answer is ${summaryEntryData.type.toUpperCase()}`,
              )
            } else {
              phrase.setAttribute(
                "title",
                `✗ You didn't mark this, but it should be ${summaryEntryData.type.toUpperCase()}`,
              )
            }
          }

          // Add hover effects for evidence files
          if (summaryEntryData.evidence_file) {
            phrase.classList.add("hover:underline")
          }
        }
      } else {
        // Highlighting mode - show user's manual highlights
        const sentenceId = `sentence-${phraseNumber}`
        const highlight = highlightedSentences.find((h) => h.id === sentenceId)

        if (highlight) {
          switch (highlight.color) {
            case "green":
              phrase.classList.add("bg-green-200", "border-l-2", "border-green-500", "px-1", "rounded")
              break
            case "red":
              phrase.classList.add("bg-red-200", "border-l-2", "border-red-500", "px-1", "rounded")
              break
            case "purple":
              phrase.classList.add("bg-purple-200", "border-l-2", "border-purple-500", "px-1", "rounded")
              break
          }
        }

        // Add cursor for highlighter mode or evidence files
        if (highlighterColor) {
          phrase.classList.add("cursor-pointer")
        } else if (summaryEntryData?.evidence_file) {
          phrase.classList.add("cursor-pointer", "hover:underline")
        } else {
          phrase.classList.add("cursor-default")
        }
      }
    })
  }, [summaryContent, loading, verdictSelected, highlightedSentences, highlighterColor, getSummaryEntry])

  if (loading) {
    return (
      <div className="overflow-y-auto p-6 flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-gray-500">Loading summary...</div>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto p-6" style={{ height: `${height}px` }}>
      <style jsx global>{`
        .analyzable-phrase {
          transition: all 0.2s ease;
          border-radius: 0.125rem;
          padding: 0.125rem 0.25rem;
          cursor: pointer;
        }

        .analyzable-phrase:hover {
          background-color: #fef3c7; /* Light yellow background */
          color: #92400e; /* Darker yellow text */
          text-decoration: underline;
          cursor: pointer;
        }

        .analyzable-phrase.cursor-pointer:hover {
          background-color: #fde68a; /* Slightly darker yellow for clickable phrases */
          color: #92400e;
          text-decoration: underline;
          cursor: pointer;
        }

        .summaryEntry {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
          line-height: 1.5;
        }
        
        .summaryEntry:hover {
          color: #b58e00; /* Yellow text color on hover */
        }
        
        .summaryEntry.cursor-pointer:hover {
          color: #b58e00; /* Yellow text color on hover */
          text-decoration: underline;
        }

        .summary-content h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .summary-content h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #444;
        }
        
        .summary-content p {
          margin-bottom: 1rem;
          line-height: 1.5;
        }
      `}</style>

      {verdictSelected && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">🔍 Investigation Mode Active</h3>
          <p className="text-sm text-blue-700 mb-2">Comparing your analysis with the correct answers:</p>
          <div className="flex gap-4 text-xs mb-2">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border-l-4 border-green-500 rounded"></div>
              <span>Facts (Green border = correct answer)</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border-l-4 border-red-500 rounded"></div>
              <span>Misrepresentations (Red border = correct answer)</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-100 border-l-4 border-purple-500 rounded"></div>
              <span>Hallucinations (Purple border = correct answer)</span>
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 ring-2 ring-green-400 rounded"></div>
              <span>Your analysis was correct</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 ring-2 ring-red-400 rounded"></div>
              <span>Your analysis was incorrect</span>
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-2">Background color = your choice, Border color = correct answer</p>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: summaryContent }} />

      {!verdictSelected && highlighterColor && (
        <div className="mt-6 p-3 bg-gray-100 rounded-lg sticky bottom-0">
          <p className="text-sm text-gray-600">
            <strong>Analysis Mode:</strong> Click on highlighted phrases (yellow on hover) to mark them as{" "}
            <span
              className={`px-2 py-1 rounded ${
                highlighterColor === "green"
                  ? "bg-green-200"
                  : highlighterColor === "red"
                    ? "bg-red-200"
                    : "bg-purple-200"
              }`}
            >
              {highlighterColor === "green"
                ? "FACTS"
                : highlighterColor === "red"
                  ? "MISREPRESENTATIONS"
                  : "HALLUCINATIONS"}
            </span>
            . Identify which AI claims are supported by evidence.
          </p>
        </div>
      )}

      {/* Evidence Viewer Window */}
      {evidenceWindow && (
        <EvidenceViewerWindow
          title={evidenceWindow.title}
          content={evidenceWindow.content}
          phraseNumber={evidenceWindow.phraseNumber}
          onClose={() => setEvidenceWindow(null)}
          onCategorize={handleCategorize}
        />
      )}
    </div>
  )
}

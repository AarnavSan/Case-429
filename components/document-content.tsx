"use client"

import { useState, useEffect } from "react"
import { useDatabase } from "../hooks/use-database"

interface DocumentContentProps {
  highlighterColor: "green" | "red" | "purple" | null
  height?: number
  verdictSelected?: boolean
  onEvidenceClick?: (evidenceFile: string) => void
}

interface HighlightedSentence {
  id: string
  color: "green" | "red" | "purple"
}

export default function DocumentContent({
  highlighterColor,
  height = 400,
  verdictSelected = false,
  onEvidenceClick,
}: DocumentContentProps) {
  const [highlightedSentences, setHighlightedSentences] = useState<HighlightedSentence[]>([])
  const [summaryContent, setSummaryContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { getSummaryEntry } = useDatabase()

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

  useEffect(() => {
    if (!summaryContent || loading) return

    const handleSummaryEntryClick = (e: Event) => {
      const target = e.target as HTMLElement
      const analyzablePhrase = target.closest(".analyzable-phrase")
      if (!analyzablePhrase) return

      const phraseNumber = Number.parseInt(analyzablePhrase.getAttribute("data-phrase") || "0")
      if (!phraseNumber) return

      if (verdictSelected) {
        // In game mode - check for evidence file
        const summaryEntryData = getSummaryEntry("Flora Jasmine", phraseNumber)
        if (summaryEntryData?.evidence_file && onEvidenceClick) {
          onEvidenceClick(summaryEntryData.evidence_file)
          return
        }
      }

      // In highlighter mode
      if (!highlighterColor) return

      const sentenceId = `sentence-${phraseNumber}`
      setHighlightedSentences((prev) => {
        const existing = prev.find((h) => h.id === sentenceId)
        if (existing) {
          if (existing.color === highlighterColor) {
            return prev.filter((h) => h.id !== sentenceId)
          }
          return prev.map((h) => (h.id === sentenceId ? { ...h, color: highlighterColor } : h))
        }
        return [...prev, { id: sentenceId, color: highlighterColor }]
      })
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

    // Apply styling to analyzable phrases based on game mode or manual highlights
    const analyzablePhrases = document.querySelectorAll(".analyzable-phrase")
    analyzablePhrases.forEach((phrase) => {
      const phraseNumber = Number.parseInt(phrase.getAttribute("data-phrase") || "0")
      if (!phraseNumber) return

      // Reset classes
      phrase.className = "analyzable-phrase"

      if (verdictSelected) {
        // In game mode - use database colors
        const summaryEntryData = getSummaryEntry("Flora Jasmine", phraseNumber)
        if (summaryEntryData) {
          switch (summaryEntryData.type) {
            case "green":
              phrase.classList.add("bg-green-100", "border-l-2", "border-green-500", "px-1", "rounded")
              break
            case "red":
              phrase.classList.add("bg-red-100", "border-l-2", "border-red-500", "px-1", "rounded")
              break
            case "purple":
              phrase.classList.add("bg-purple-100", "border-l-2", "border-purple-500", "px-1", "rounded")
              break
          }

          // Add cursor and hover effects
          if (summaryEntryData.evidence_file) {
            phrase.classList.add("cursor-pointer", "hover:underline", "hover:text-blue-600")
          } else {
            phrase.classList.add("cursor-default")
          }

          // Add tooltip
          const typeLabels = {
            green: "FACT - Supported by evidence",
            red: "MISREPRESENTATION - Misleading interpretation",
            purple: "HALLUCINATION - No evidence found",
          }

          const tooltipText = summaryEntryData.evidence_file
            ? `${typeLabels[summaryEntryData.type]} - Click to view evidence`
            : typeLabels[summaryEntryData.type]

          phrase.setAttribute("title", tooltipText)
        }
      } else {
        // In highlighter mode - use manual highlights
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

        // Add cursor for highlighter mode
        if (highlighterColor) {
          phrase.classList.add("cursor-pointer")
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
          <p className="text-sm text-blue-700 mb-2">
            Analyze the AI's claims. Look for <span className="text-purple-600 font-bold">hallucinations</span> to prove
            Flora's innocence.
          </p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
              <span>Facts</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
              <span>Misrepresentations</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-100 border border-purple-500 rounded"></div>
              <span>Hallucinations</span>
            </span>
          </div>
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
    </div>
  )
}

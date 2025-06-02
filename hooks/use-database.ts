"use client"

import { useState, useEffect } from "react"

interface SummaryEntry {
  phrase_number: number
  type: "green" | "red" | "purple"
  evidence_file: string | null
}

interface Suspect {
  name: string
  summaryEntries: SummaryEntry[]
}

interface Database {
  suspects: Suspect[]
}

// Fallback database in case the JSON file can't be loaded
const fallbackDatabase: Database = {
  suspects: [
    {
      name: "Flora Jasmine",
      summaryEntries: [
        {
          phrase_number: 1,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/personal-profile.html",
        },
        {
          phrase_number: 2,
          type: "red",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/police-statement.html",
        },
        {
          phrase_number: 3,
          type: "red",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/police-statement.html",
        },
        {
          phrase_number: 4,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          phrase_number: 5,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/academic-research.html",
        },
        {
          phrase_number: 6,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/financial-records.html",
        },
        {
          phrase_number: 7,
          type: "red",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        { phrase_number: 8, type: "purple", evidence_file: null },
        { phrase_number: 9, type: "purple", evidence_file: null },
        {
          phrase_number: 10,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/financial-records.html",
        },
        {
          phrase_number: 11,
          type: "red",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        { phrase_number: 12, type: "purple", evidence_file: null },
        { phrase_number: 13, type: "purple", evidence_file: null },
        {
          phrase_number: 14,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/academic-research.html",
        },
        {
          phrase_number: 15,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          phrase_number: 16,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          phrase_number: 17,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          phrase_number: 18,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          phrase_number: 19,
          type: "green",
          evidence_file: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
      ],
    },
  ],
}

export function useDatabase() {
  const [database, setDatabase] = useState<Database | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        console.log("Loading database from JSON file...")
        const response = await fetch("/database/suspects.json")
        if (!response.ok) {
          throw new Error(`Failed to load database: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        console.log("Database loaded successfully")
        setDatabase(data)
      } catch (err) {
        console.error("Database loading error:", err)
        console.log("Using fallback database due to error")
        setError(err instanceof Error ? err.message : "Unknown error")
        setDatabase(fallbackDatabase)
      } finally {
        setLoading(false)
      }
    }

    loadDatabase()
  }, [])

  const getSuspectData = (suspectName: string): Suspect | null => {
    if (!database) {
      console.log("Database not available for getSuspectData")
      return null
    }
    const suspect = database.suspects.find((suspect) => suspect.name === suspectName)
    return suspect || null
  }

  const getSummaryEntry = (suspectName: string, phraseNumber: number): SummaryEntry | null => {
    if (!database) {
      console.log("Database not available for getSummaryEntry")
      return null
    }

    const suspect = getSuspectData(suspectName)
    if (!suspect) {
      console.log(`Suspect "${suspectName}" not found`)
      return null
    }

    const entry = suspect.summaryEntries.find((entry) => entry.phrase_number === phraseNumber)
    return entry || null
  }

  return {
    database,
    loading,
    error,
    getSuspectData,
    getSummaryEntry,
  }
}

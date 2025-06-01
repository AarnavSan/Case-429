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

export function useDatabase() {
  const [database, setDatabase] = useState<Database | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const response = await fetch("/assets/database/suspects.json")
        if (!response.ok) {
          throw new Error("Failed to load database")
        }
        const data = await response.json()
        setDatabase(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    loadDatabase()
  }, [])

  const getSuspectData = (suspectName: string): Suspect | null => {
    if (!database) return null
    return database.suspects.find((suspect) => suspect.name === suspectName) || null
  }

  const getSummaryEntry = (suspectName: string, phraseNumber: number): SummaryEntry | null => {
    const suspect = getSuspectData(suspectName)
    if (!suspect) return null
    return suspect.summaryEntries.find((entry) => entry.phrase_number === phraseNumber) || null
  }

  return {
    database,
    loading,
    error,
    getSuspectData,
    getSummaryEntry,
  }
}

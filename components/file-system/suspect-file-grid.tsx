"use client"

import { useState } from "react"
import type { FileItem } from "./file-system-data"
import { loadFileContent } from "./file-system-data"
import DocumentIcon from "./document-icon"
import ImageIcon from "./image-icon"
import AudioIcon from "./audio-icon"
import TextViewerWindow from "../windows/text-viewer-window"
import ImageViewerWindow from "../windows/image-viewer-window"
import AudioPlayerWindow from "../windows/audio-player-window"

interface SuspectFileGridProps {
  files: FileItem[]
  suspectName: string
}

interface OpenWindow {
  id: string
  type: "text" | "image" | "audio"
  title: string
  content?: string
  path?: string
}

export default function SuspectFileGrid({ files, suspectName }: SuspectFileGridProps) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])

  const openTextDocument = async (title: string, filePath?: string, fallbackContent?: string) => {
    const id = `text-${Date.now()}`
    let content = fallbackContent || "No content available."

    if (filePath) {
      try {
        // Check if the file is HTML
        if (filePath.endsWith(".html")) {
          content = await loadFileContent(filePath)
        } else {
          // For non-HTML files, wrap content in pre tags
          content = `<pre>${await loadFileContent(filePath)}</pre>`
        }
      } catch (error) {
        console.error("Error loading file:", error)
        content = "Error loading file content."
      }
    }

    setOpenWindows((prev) => [...prev, { id, type: "text", title, content }])
  }

  const openImageViewer = (title: string, imagePath: string) => {
    const id = `image-${Date.now()}`
    setOpenWindows((prev) => [...prev, { id, type: "image", title, path: imagePath }])
  }

  const openAudioPlayer = (title: string, audioPath: string) => {
    const id = `audio-${Date.now()}`
    setOpenWindows((prev) => [...prev, { id, type: "audio", title, path: audioPath }])
  }

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id))
  }

  const handleFileClick = (file: FileItem) => {
    switch (file.type) {
      case "document":
        // Convert .txt paths to .html for proper rendering
        const htmlPath = file.path?.replace(".txt", ".html")
        openTextDocument(file.name, htmlPath, file.content)
        break
      case "image":
        openImageViewer(file.name, file.path || "/placeholder.svg")
        break
      case "audio":
        openAudioPlayer(file.name, file.path || "/placeholder-audio.mp3")
        break
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {files.map((file) => {
          switch (file.type) {
            case "document":
              return <DocumentIcon key={file.id} name={file.name} onClick={() => handleFileClick(file)} />
            case "image":
              return <ImageIcon key={file.id} name={file.name} onClick={() => handleFileClick(file)} />
            case "audio":
              return <AudioIcon key={file.id} name={file.name} onClick={() => handleFileClick(file)} />
            default:
              return null
          }
        })}
      </div>

      {/* Render open windows */}
      {openWindows.map((window) => {
        switch (window.type) {
          case "text":
            return (
              <TextViewerWindow
                key={window.id}
                title={window.title}
                content={window.content || ""}
                onClose={() => closeWindow(window.id)}
              />
            )
          case "image":
            return (
              <ImageViewerWindow
                key={window.id}
                title={window.title}
                imagePath={window.path || ""}
                onClose={() => closeWindow(window.id)}
              />
            )
          case "audio":
            return (
              <AudioPlayerWindow
                key={window.id}
                title={window.title}
                audioPath={window.path || ""}
                onClose={() => closeWindow(window.id)}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

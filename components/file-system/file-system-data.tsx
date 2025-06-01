// File system data structure
export interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "audio"
  content?: string
  path?: string
  children?: FileItem[]
}

export const fileSystemData: FileItem = {
  id: "root",
  name: "Suspects",
  type: "folder",
  children: [
    {
      id: "flora-jasmine",
      name: "Flora Jasmine",
      type: "folder",
      children: [
        {
          id: "flora-summary",
          name: "AI Summary",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/summary.html",
        },
        {
          id: "flora-profile",
          name: "Personal Profile",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/personal-profile.html",
        },
        {
          id: "flora-statement",
          name: "Police Statement",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/police-statement.html",
        },
        {
          id: "flora-timeline",
          name: "Timeline Analysis",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/timeline-analysis.html",
        },
        {
          id: "flora-financial",
          name: "Financial Records",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/financial-records.html",
        },
        {
          id: "flora-research",
          name: "Academic Research",
          type: "document",
          path: "/assets/file-system/suspects/flora-jasmine/academic-research.html",
        },
        {
          id: "flora-voicemail",
          name: "Voicemail to Marcus",
          type: "audio",
          path: "/assets/file-system/suspects/flora-jasmine/voicemail-marcus.mp3",
        },
        {
          id: "flora-photo1",
          name: "University ID Photo",
          type: "image",
          path: "/placeholder.svg?height=400&width=300&text=Flora+Jasmine+University+ID",
        },
        {
          id: "flora-photo2",
          name: "Security Camera Still",
          type: "image",
          path: "/placeholder.svg?height=400&width=600&text=Security+Camera+Flora+Leaving+University",
        },
      ],
    },
    {
      id: "sir-eric-harpe",
      name: "Sir Eric Harpe (Deceased)",
      type: "folder",
      children: [
        {
          id: "eric-locked",
          name: "Access Restricted",
          type: "document",
          content:
            "<div class='document-content'><h1>ACCESS RESTRICTED</h1><p>These files require higher clearance level.</p></div>",
        },
      ],
    },
    {
      id: "mrs-ferris",
      name: "Mrs. Ferris",
      type: "folder",
      children: [
        {
          id: "ferris-locked",
          name: "Access Restricted",
          type: "document",
          content:
            "<div class='document-content'><h1>ACCESS RESTRICTED</h1><p>These files require higher clearance level.</p></div>",
        },
      ],
    },
    {
      id: "eddie",
      name: "Eddie",
      type: "folder",
      children: [
        {
          id: "eddie-locked",
          name: "Access Restricted",
          type: "document",
          content:
            "<div class='document-content'><h1>ACCESS RESTRICTED</h1><p>These files require higher clearance level.</p></div>",
        },
      ],
    },
    {
      id: "dev-patel",
      name: "Dev Patel",
      type: "folder",
      children: [
        {
          id: "dev-locked",
          name: "Access Restricted",
          type: "document",
          content:
            "<div class='document-content'><h1>ACCESS RESTRICTED</h1><p>These files require higher clearance level.</p></div>",
        },
      ],
    },
    {
      id: "dr-cecelia-sheppard",
      name: "Dr. Cecelia Sheppard",
      type: "folder",
      children: [
        {
          id: "cecelia-locked",
          name: "Access Restricted",
          type: "document",
          content:
            "<div class='document-content'><h1>ACCESS RESTRICTED</h1><p>These files require higher clearance level.</p></div>",
        },
      ],
    },
  ],
}

// Helper function to find Flora Jasmine's files
export const getFloraJasmineFiles = (): FileItem[] => {
  const floraFolder = fileSystemData.children?.find((item) => item.id === "flora-jasmine")
  return floraFolder?.children || []
}

// Helper function to get all suspect folders (for navigation)
export const getSuspectFolders = (): FileItem[] => {
  return fileSystemData.children || []
}

// Helper function to load file content from assets
export const loadFileContent = async (filePath: string): Promise<string> => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error loading file:", error)
    return "Error loading file content."
  }
}

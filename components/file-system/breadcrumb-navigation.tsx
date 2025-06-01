"use client"

import { ChevronRight, Folder } from "lucide-react"

interface BreadcrumbNavigationProps {
  currentPath: string[]
}

export default function BreadcrumbNavigation({ currentPath }: BreadcrumbNavigationProps) {
  return (
    <div className="flex items-center gap-2 mb-4 text-white">
      <Folder className="w-4 h-4" />
      {currentPath.map((folder, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm font-medium">{folder}</span>
          {index < currentPath.length - 1 && <ChevronRight className="w-3 h-3" />}
        </div>
      ))}
    </div>
  )
}

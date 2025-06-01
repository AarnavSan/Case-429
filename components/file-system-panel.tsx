"use client"

import { getFloraJasmineFiles } from "./file-system/file-system-data"
import BreadcrumbNavigation from "./file-system/breadcrumb-navigation"
import SuspectFileGrid from "./file-system/suspect-file-grid"

export default function FileSystemPanel() {
  const floraFiles = getFloraJasmineFiles()
  const currentPath = ["Suspects", "Flora Jasmine"]

  return (
    <div className="w-72">
      <div className="bg-[#263851] rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Case Files</h2>

        <BreadcrumbNavigation currentPath={currentPath} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Flora Jasmine</h3>
          <p className="text-sm text-gray-300 mb-4">Primary Suspect - Step-daughter of victim</p>
        </div>

        <SuspectFileGrid files={floraFiles} suspectName="Flora Jasmine" />

        {floraFiles.length === 0 && (
          <div className="text-center text-gray-300 py-8">
            <p>No files available for this suspect.</p>
          </div>
        )}
      </div>
    </div>
  )
}

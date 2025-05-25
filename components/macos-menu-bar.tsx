export default function MacOSMenuBar() {
  return (
    <div className="bg-[#f7f7f7] h-6 flex items-center justify-between px-4 text-xs text-[#000000] border-b border-[#e5e5e5]">
      <div className="flex items-center space-x-4">
        <span className="font-medium">🍎</span>
        <span>Finder</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Window</span>
        <span>Help</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>🔋</span>
        <span>📶</span>
        <span>🔍</span>
        <span>📶</span>
        <span>Mon Jun 22</span>
        <span>9:41 AM</span>
      </div>
    </div>
  )
}

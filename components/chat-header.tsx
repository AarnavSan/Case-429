export default function ChatHeader() {
  return (
    <div className="bg-[#d6c6c6] rounded-t-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#263851] rounded-full flex items-center justify-center">
        <span className="text-white text-lg">🕵️</span>
      </div>
      <div>
        <div className="text-[#000000] font-medium">From: Sherlock</div>
      </div>
    </div>
  )
}

"use client"

interface VerdictButtonsProps {
  onVerdictSelect: (verdict: "guilty" | "not-guilty") => void
}

export default function VerdictButtons({ onVerdictSelect }: VerdictButtonsProps) {
  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={() => onVerdictSelect("guilty")}
        className="px-6 py-2 rounded-full font-medium transition-all duration-200 bg-white/80 text-[#000000] hover:bg-[#ffaaaa] hover:scale-105"
      >
        Guilty
      </button>
      <button
        onClick={() => onVerdictSelect("not-guilty")}
        className="px-6 py-2 rounded-full font-medium transition-all duration-200 bg-white/80 text-[#000000] hover:bg-[#06ff0b] hover:scale-105"
      >
        Not Guilty
      </button>
    </div>
  )
}

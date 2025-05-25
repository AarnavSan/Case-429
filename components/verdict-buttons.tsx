"use client"

interface VerdictButtonsProps {
  verdict: "guilty" | "not-guilty" | null
  onVerdictSelect: (verdict: "guilty" | "not-guilty") => void
}

export default function VerdictButtons({ verdict, onVerdictSelect }: VerdictButtonsProps) {
  return (
    <>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => onVerdictSelect("guilty")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            verdict === "guilty"
              ? "bg-[#ffaaaa] text-[#000000] scale-105 shadow-lg"
              : "bg-white/80 text-[#000000] hover:bg-[#ffaaaa] hover:scale-105"
          }`}
        >
          Guilty
        </button>
        <button
          onClick={() => onVerdictSelect("not-guilty")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            verdict === "not-guilty"
              ? "bg-[#06ff0b] text-[#000000] scale-105 shadow-lg"
              : "bg-white/80 text-[#000000] hover:bg-[#06ff0b] hover:scale-105"
          }`}
        >
          Not Guilty
        </button>
      </div>

      {verdict && (
        <div className="bg-white/90 rounded-2xl p-3 max-w-[280px] mx-auto text-center">
          <p className="text-[#000000] text-sm font-medium">
            Verdict Selected: {verdict === "guilty" ? "Guilty" : "Not Guilty"}
          </p>
        </div>
      )}
    </>
  )
}

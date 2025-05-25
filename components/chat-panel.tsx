import ChatHeader from "./chat-header"
import ChatMessage from "./chat-message"
import VerdictButtons from "./verdict-buttons"
import ChatInput from "./chat-input"

interface ChatPanelProps {
  verdict: "guilty" | "not-guilty" | null
  onVerdictSelect: (verdict: "guilty" | "not-guilty") => void
}

export default function ChatPanel({ verdict, onVerdictSelect }: ChatPanelProps) {
  const messages = [
    "The guilty of murder evidence is not sufficient to convict her.",
    "My dear, dear, Watson...",
    "It looks like your misclassification of the information in the AI summary or accepting misrepresentations as facts led you to overlook a lot of ambiguity involved in this summary! Here's a corrected sheet...review it to avoid future mistakes!",
    "The timeline doesn't add up, Holmes. There are gaps in her alibi.",
    "Elementary! But we must consider all possibilities. The evidence suggests premeditation, yet something feels amiss about this entire case.",
    "What about the financial records? They show irregular transactions.",
    "Precisely, Watson. Follow the money trail - it often reveals more than testimonies ever could.",
  ]

  return (
    <div className="w-80 flex flex-col">
      <ChatHeader />

      <div className="flex-1 bg-[#5b8bd8] p-4 space-y-4 overflow-y-auto">
        <ChatMessage message={messages[0]} />

        <VerdictButtons verdict={verdict} onVerdictSelect={onVerdictSelect} />

        <ChatMessage message={messages[1]} />

        <ChatMessage message={messages[2]} maxWidth="max-w-[280px]" />

        <ChatMessage message={messages[3]} />

        <ChatMessage message={messages[4]} maxWidth="max-w-[280px]" />

        <ChatMessage message={messages[5]} />

        <ChatMessage message={messages[6]} maxWidth="max-w-[280px]" />

        <div className="flex justify-center pt-4">
          <div className="text-white text-2xl">•••</div>
        </div>
      </div>

      <ChatInput />
    </div>
  )
}

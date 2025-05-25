interface ChatMessageProps {
  message: string
  maxWidth?: string
}

export default function ChatMessage({ message, maxWidth = "max-w-[250px]" }: ChatMessageProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 ${maxWidth}`}>
      <p className="text-[#000000] text-sm">{message}</p>
    </div>
  )
}

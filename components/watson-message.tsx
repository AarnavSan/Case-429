interface WatsonMessageProps {
  message: string
  maxWidth?: string
}

export default function WatsonMessage({ message, maxWidth = "max-w-[250px]" }: WatsonMessageProps) {
  return (
    <div className="flex justify-end">
      <div className={`bg-green-100 rounded-2xl p-4 ${maxWidth}`}>
        <p className="text-[#000000] text-sm">{message}</p>
      </div>
    </div>
  )
}

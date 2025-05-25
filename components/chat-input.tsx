import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatInput() {
  return (
    <div className="bg-[#5b8bd8] p-4">
      <div className="bg-white rounded-lg flex items-center">
        <input type="text" className="flex-1 p-3 rounded-lg border-0 outline-none" placeholder="" />
        <Button size="icon" variant="ghost" className="mr-2">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Clock } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-2xl">
          <div className="bg-primary text-primary-foreground rounded-2xl px-5 py-3 max-w-lg">
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-accent-foreground">U</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-3xl">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-2">
          <div className="bg-muted rounded-2xl px-5 py-3">
            <p className="text-sm text-foreground">
              {message.content}{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Employee Travel Policy, Section 4.2.
              </a>
            </p>
          </div>
          <div className="flex gap-2 px-5">
            <button className="w-2 h-2 rounded-full bg-muted-foreground hover:bg-foreground transition" />
            <button className="w-2 h-2 rounded-full bg-muted-foreground hover:bg-foreground transition" />
            <button className="w-2 h-2 rounded-full bg-muted-foreground hover:bg-foreground transition" />
          </div>
        </div>
      </div>
    </div>
  )
}

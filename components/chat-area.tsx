"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "@/components/message-bubble"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatArea({ messages, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center px-6">
        <div className="flex-1" />
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <span className="text-sm font-semibold text-accent-foreground">AS</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">No messages yet</p>
              <p className="text-muted-foreground text-sm mt-2">
                Start by asking about company policies, procedures, or templates
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1 flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about company policies, procedures, or templates..."
              className="flex-1 bg-input text-foreground placeholder-muted-foreground rounded-lg px-4 py-3 border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none max-h-32"
              rows={1}
            />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Paperclip className="w-5 h-5" />
            </Button>
          </div>
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

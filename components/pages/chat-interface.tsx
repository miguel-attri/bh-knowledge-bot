"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"

interface ChatInterfaceProps {
  selectedConversationId: string | null
  onBack: () => void
  onLogout: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface Conversation {
  id: string
  title: string
  timestamp: number
  createdAt: number
  lastUpdated: number
}

export function ChatInterface({ selectedConversationId, onBack, onLogout }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "PTO Policy Inquiry",
      timestamp: Date.now() - 86400000,
      createdAt: Date.now() - 86400000,
      lastUpdated: Date.now() - 3600000,
    },
    {
      id: "2",
      title: "Expense Report Guide",
      timestamp: Date.now() - 172800000,
      createdAt: Date.now() - 172800000,
      lastUpdated: Date.now() - 7200000,
    },
    {
      id: "3",
      title: "Template for Client Onboarding",
      timestamp: Date.now() - 259200000,
      createdAt: Date.now() - 259200000,
      lastUpdated: Date.now() - 10800000,
    },
    {
      id: "4",
      title: "2024 Tax Checklist",
      timestamp: Date.now() - 345600000,
      createdAt: Date.now() - 345600000,
      lastUpdated: Date.now() - 14400000,
    },
  ])

  const [currentConversationId, setCurrentConversationId] = useState<string>(selectedConversationId || "new")
  const [messages, setMessages] = useState<Message[]>([])

  // Load messages based on selected conversation
  useEffect(() => {
    if (selectedConversationId && selectedConversationId !== "new") {
      if (selectedConversationId === "1") {
        setMessages([
          {
            id: "1",
            role: "user",
            content: "How do I submit an expense report for travel?",
            timestamp: Date.now() - 30000,
          },
          {
            id: "2",
            role: "assistant",
            content:
              "To submit a travel expense report, you need to complete Employee Form T-12 and submit it via the internal portal. You can find the official template and detailed instructions in the Employee Travel Policy, Section 4.2.",
            timestamp: Date.now() - 25000,
          },
          {
            id: "3",
            role: "user",
            content: "What's the per diem for meals?",
            timestamp: Date.now() - 10000,
          },
          {
            id: "4",
            role: "assistant",
            content: "The per diem for meals is $75 per day, as stated in the Employee Travel Policy document.",
            timestamp: Date.now() - 5000,
          },
        ])
      } else {
        setMessages([])
      }
    } else {
      setMessages([])
    }
  }, [selectedConversationId])

  const handleNewChat = () => {
    setCurrentConversationId("new")
    setMessages([])
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id)
  }

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content:
          "I can help you with that. For more detailed information, please refer to the company knowledge base or contact HR.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  // Suggested follow-up questions - can be customized per conversation
  const suggestedQuestions = [
    "What's the PTO policy for this year?",
    "How do I submit an expense report?",
    "Where can I find client onboarding templates?",
    "What are the healthcare enrollment deadlines?",
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onLogout={onLogout}
      />
      <ChatArea messages={messages} onSendMessage={handleSendMessage} suggestedQuestions={suggestedQuestions} />
    </div>
  )
}

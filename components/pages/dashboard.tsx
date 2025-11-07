"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { Search, Settings, LogOut, MessageCircle, ChevronDown, Plus, Mic, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardProps {
  onLogout: () => void
}

interface Conversation {
  id: string
  title: string
  date: string
}

interface ConversationMessage {
  id: string
  sender: "user" | "bot"
  text: string
}

const initialConversations: Conversation[] = [
  { id: "1", title: "PTO Policy Inquiry", date: "TODAY" },
  { id: "2", title: "Template for Client Onboarding", date: "TODAY" },
  { id: "3", title: "Expense Reporting Guidelines", date: "YESTERDAY" },
  { id: "4", title: "401(k) Contribution Limits", date: "YESTERDAY" },
  { id: "5", title: "Continuing Education Policy", date: "PREVIOUS 7 DAYS" },
  { id: "6", title: "Marketing Material Request", date: "PREVIOUS 7 DAYS" },
  { id: "7", title: "IT Support for New Laptop", date: "PREVIOUS 7 DAYS" },
]

const STATIC_BOT_REPLY =
  "Thanks for reaching out! This is a placeholder response from the Knowledge Bot while we wire up the real service."

export function Dashboard({ onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversationsList, setConversationsList] = useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ConversationMessage[]>
  >({})
  const [messageInput, setMessageInput] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        event.target instanceof Node &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false)
      }
    }

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isAccountMenuOpen])

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current)
      }
    }
  }, [])

  const filteredConversations = conversationsList.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    if (!acc[conv.date]) {
      acc[conv.date] = []
    }
    acc[conv.date].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  const dateOrder = ["TODAY", "YESTERDAY", "PREVIOUS 7 DAYS"]

  const activeConversation = conversationsList.find(
    (conversation) => conversation.id === activeConversationId,
  )

  const activeMessages = activeConversationId
    ? messagesByConversation[activeConversationId] ?? []
    : []

  const hasMessages = activeMessages.length > 0 || isBotTyping

  const resetBotTyping = () => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current)
    }
    setIsBotTyping(false)
  }

  const handleAddSession = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      date: "TODAY",
    }

    setConversationsList((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    setMessagesByConversation((prev) => ({ ...prev, [newConversation.id]: [] }))
    setSearchQuery("")
    resetBotTyping()
  }

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setSearchQuery("")
    resetBotTyping()
  }

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeConversationId) {
      return
    }

    const trimmed = messageInput.trim()
    if (!trimmed) {
      return
    }

    const conversationId = activeConversationId
    const userMessage: ConversationMessage = {
      id: `${conversationId}-${Date.now()}-user`,
      sender: "user",
      text: trimmed,
    }

    setMessagesByConversation((prev) => {
      const currentMessages = prev[conversationId] ?? []
      return {
        ...prev,
        [conversationId]: [...currentMessages, userMessage],
      }
    })

    setMessageInput("")
    setIsBotTyping(true)

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current)
    }

    replyTimeoutRef.current = setTimeout(() => {
      const botMessage: ConversationMessage = {
        id: `${conversationId}-${Date.now()}-bot`,
        sender: "bot",
        text: STATIC_BOT_REPLY,
      }

      setMessagesByConversation((prev) => {
        const currentMessages = prev[conversationId] ?? []
        return {
          ...prev,
          [conversationId]: [...currentMessages, botMessage],
        }
      })

      setIsBotTyping(false)
    }, 450)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-foreground">Beard Harris Knowledge Bot</span>
          </div>
        </div>

        <div className="px-4 pt-4">
          <Button
            onClick={handleAddSession}
            className="w-full justify-center gap-2 rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New session
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4 pt-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {dateOrder.map((date) =>
              groupedConversations[date] ? (
                <div key={date}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {groupedConversations[date].map((conv) => {
                      const isActive = conv.id === activeConversationId
                      return (
                        <button
                          key={conv.id}
                          type="button"
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                            isActive ? "bg-muted" : "hover:bg-muted"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground truncate">{conv.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end px-6 py-4 bg-background/80 backdrop-blur">
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-8 w-8 bg-muted">
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold">
                  AH
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium text-foreground">Alex Hartman</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isAccountMenuOpen ? (
              <div className="absolute right-0 z-10 mt-3 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-foreground hover:bg-muted"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="flex-1 px-8 py-10">
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-8">
                <div
                  className={`relative flex-1 ${
                    hasMessages ? "overflow-y-auto" : "flex items-center justify-center"
                  } min-h-[320px]`}
                >
                  {activeConversation ? (
                    hasMessages ? (
                      <div className="mx-auto w-full max-w-3xl space-y-4 px-1 pb-12">
                        {activeMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70ch] whitespace-pre-wrap break-words rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-lg"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              {message.text}
                            </div>
                          </div>
                        ))}

                        {isBotTyping ? (
                          <div className="flex justify-start">
                            <div className="max-w-[70ch] rounded-3xl bg-muted px-4 py-3 text-sm text-muted-foreground shadow-sm">
                              Knowledge Bot is thinking...
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-8 text-center">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                          <MessageCircle className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            New conversation
                          </p>
                          <h2 className="text-3xl font-semibold text-foreground">
                            What&apos;s on the agenda today?
                          </h2>
                          <p className="text-muted-foreground">
                            Ask anything about Beard Harris policies, processes, and resources to get started.
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-8 text-center">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <MessageCircle className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">Create a session to get started</h2>
                        <p className="text-muted-foreground">
                          Start a new session from the sidebar to begin a conversation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <footer className="px-8 pb-10 pt-6">
              <form
                onSubmit={handleSendMessage}
                className="mx-auto flex w-full max-w-3xl items-end gap-4 rounded-full border border-border/20 bg-background/90 px-5 py-3 shadow-none backdrop-blur focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/15"
                  aria-label="Add attachment"
                >
                  <Plus className="h-5 w-5" />
                </button>

                <textarea
                  rows={1}
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder={
                    activeConversation
                      ? "Ask anything"
                      : "Create a session to start chatting"
                  }
                  disabled={!activeConversation}
                  className="flex-1 resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
                    aria-label="Start voice input"
                    disabled={!activeConversation}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                    aria-label="Send message"
                    disabled={!activeConversation || !messageInput.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

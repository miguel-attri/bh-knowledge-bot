"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Search, Settings, LogOut, MessageCircle, ChevronDown, Plus, Mic, Send, BarChart3 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChatHoverCard } from "@/components/chat-hover-card"
import { SuggestedQuestions } from "@/components/suggested-questions"
import { ProjectFolder, type Project, type ProjectFile } from "@/components/project-folder"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ConversationMenu } from "@/components/conversation-menu"
import { ConversationActionsMenu } from "@/components/conversation-actions-menu"
import { RenameConversationDialog } from "@/components/rename-conversation-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { FolderPlus, Archive } from "lucide-react"

interface DashboardProps {
  onLogout: () => void
  onNavigateToStats?: () => void
}

interface Conversation {
  id: string
  title: string
  date: string
  createdAt: number
  lastUpdated: number
  archived?: boolean
}

interface ConversationMessage {
  id: string
  sender: "user" | "bot"
  text: string
}

const now = Date.now()
const initialConversations: Conversation[] = [
  { id: "1", title: "PTO Policy Inquiry", date: "TODAY", createdAt: now - 3600000, lastUpdated: now - 1800000 },
  { id: "2", title: "Template for Client Onboarding", date: "TODAY", createdAt: now - 7200000, lastUpdated: now - 3600000 },
  { id: "3", title: "Expense Reporting Guidelines", date: "YESTERDAY", createdAt: now - 172800000, lastUpdated: now - 169200000 },
  { id: "4", title: "401(k) Contribution Limits", date: "YESTERDAY", createdAt: now - 172800000, lastUpdated: now - 165600000 },
  { id: "5", title: "Continuing Education Policy", date: "PREVIOUS 7 DAYS", createdAt: now - 518400000, lastUpdated: now - 504000000 },
  { id: "6", title: "Marketing Material Request", date: "PREVIOUS 7 DAYS", createdAt: now - 604800000, lastUpdated: now - 576000000 },
  { id: "7", title: "IT Support for New Laptop", date: "PREVIOUS 7 DAYS", createdAt: now - 691200000, lastUpdated: now - 648000000 },
  { id: "8", title: "Employee Travel Reimbursement", date: "PREVIOUS 7 DAYS", createdAt: now - 777600000, lastUpdated: now - 720000000 },
  { id: "9", title: "Healthcare Enrollment Follow-up", date: "PREVIOUS 7 DAYS", createdAt: now - 864000000, lastUpdated: now - 792000000 },
  { id: "10", title: "Quarterly Budget Guidelines", date: "PREVIOUS 7 DAYS", createdAt: now - 950400000, lastUpdated: now - 864000000 },
  { id: "11", title: "New Hire Equipment Checklist", date: "PREVIOUS 7 DAYS", createdAt: now - 1036800000, lastUpdated: now - 936000000 },
  { id: "12", title: "Security Awareness Refresher", date: "PREVIOUS 7 DAYS", createdAt: now - 1123200000, lastUpdated: now - 1008000000 },
]

const initialMessagesByConversation: Record<string, ConversationMessage[]> = {
  "1": [
    {
      id: "1-1-user",
      sender: "user",
      text: "Can you clarify how many PTO days I have left this year?",
    },
    {
      id: "1-2-bot",
      sender: "bot",
      text: "Sure thing! Full-time employees accrue 15 days annually. You currently have 7 days remaining in your balance.",
    },
    {
      id: "1-3-user",
      sender: "user",
      text: "Great, thanks! Do unused days roll over?",
    },
    {
      id: "1-4-bot",
      sender: "bot",
      text: "Unused days do not roll over, but you can request to cash out up to 5 days before December 15th.",
    },
  ],
  "2": [
    {
      id: "2-1-user",
      sender: "user",
      text: "Do we have a standardized client onboarding template I can use for new engagements?",
    },
    {
      id: "2-2-bot",
      sender: "bot",
      text: "Yes! Check the Knowledge Library under Sales Enablement → Client Experience. The 'BH Onboarding Playbook' includes slides, email copy, and a kickoff checklist.",
    },
    {
      id: "2-3-user",
      sender: "user",
      text: "Is it okay to customize the slide deck?",
    },
    {
      id: "2-4-bot",
      sender: "bot",
      text: "Absolutely—just keep the first three intro slides intact and update the timeline to match the client scope.",
    },
  ],
  "3": [
    {
      id: "3-1-user",
      sender: "user",
      text: "What supporting documents are required for expense reporting?",
    },
    {
      id: "3-2-bot",
      sender: "bot",
      text: "Receipts are needed for any expense over $25. Please include the client or project code when you submit.",
    },
    {
      id: "3-3-user",
      sender: "user",
      text: "Is there a deadline for submitting receipts after travel?",
    },
    {
      id: "3-4-bot",
      sender: "bot",
      text: "Yes, please submit within 14 days of your travel end date so Accounting can close the period on time.",
    },
  ],
  "4": [
    {
      id: "4-1-user",
      sender: "user",
      text: "What is the current 401(k) company match?",
    },
    {
      id: "4-2-bot",
      sender: "bot",
      text: "Beaird Harris matches 50% of your contributions up to 6% of eligible compensation.",
    },
    {
      id: "4-3-user",
      sender: "user",
      text: "When can I change my contribution percentage?",
    },
    {
      id: "4-4-bot",
      sender: "bot",
      text: "You can update it anytime through Principal's online portal. Changes typically take effect on the next payroll cycle.",
    },
  ],
  "5": [
    {
      id: "5-1-user",
      sender: "user",
      text: "I'm planning a certification course—will the continuing education policy cover the cost?",
    },
    {
      id: "5-2-bot",
      sender: "bot",
      text: "Beaird Harris reimburses up to $1,200 per fiscal year for approved courses. You'll need to submit the syllabus and receipt.",
    },
  ],
  "6": [
    {
      id: "6-1-user",
      sender: "user",
      text: "Marketing asked me to provide new brochure copies—what’s the request process?",
    },
    {
      id: "6-2-bot",
      sender: "bot",
      text: "Submit a ticket through the Marketing Hub form. Include quantity, brand variant, and the event or campaign date.",
    },
    {
      id: "6-3-user",
      sender: "user",
      text: "How long does fulfillment usually take?",
    },
    {
      id: "6-4-bot",
      sender: "bot",
      text: "Printed materials ship within 5 business days. Digital assets are delivered within 48 hours.",
    },
  ],
  "7": [
    {
      id: "7-1-user",
      sender: "user",
      text: "My new laptop arrived—how do I get it configured for remote access?",
    },
    {
      id: "7-2-bot",
      sender: "bot",
      text: "Run the BH Setup app located on the desktop. It installs VPN, Office, and security tools automatically.",
    },
    {
      id: "7-3-user",
      sender: "user",
      text: "Do I need to submit anything when I return my old device?",
    },
    {
      id: "7-4-bot",
      sender: "bot",
      text: "Yes, attach the prepaid FedEx label included in your package and drop it off within 7 days. IT will notify you once it's received.",
    },
  ],
  "8": [
    {
      id: "8-1-user",
      sender: "user",
      text: "What rate should I use for mileage when traveling between client sites?",
    },
    {
      id: "8-2-bot",
      sender: "bot",
      text: "Use the current IRS mileage rate of $0.67 per mile. Add the total to the 'Travel' section of your reimbursement form.",
    },
  ],
  "9": [
    {
      id: "9-1-user",
      sender: "user",
      text: "I submitted my healthcare enrollment—how do I confirm everything went through?",
    },
    {
      id: "9-2-bot",
      sender: "bot",
      text: "Log into Paylocity → Self-Service Portal → Benefits. You’ll see a green check next to the plans you selected once HR approves them.",
    },
    {
      id: "9-3-user",
      sender: "user",
      text: "When do the new benefits take effect?",
    },
    {
      id: "9-4-bot",
      sender: "bot",
      text: "Coverage starts on the first day of the month following your submission. Payroll deductions will reflect on that paycheck too.",
    },
  ],
  "10": [
    {
      id: "10-1-user",
      sender: "user",
      text: "Can you remind me what should be included in the quarterly budget update?",
    },
    {
      id: "10-2-bot",
      sender: "bot",
      text: "Each department submits updated spend-to-date, forecast for the remaining quarters, and any variance explanations over 5%.",
    },
    {
      id: "10-3-user",
      sender: "user",
      text: "Is there a template we should use?",
    },
    {
      id: "10-4-bot",
      sender: "bot",
      text: "Yes—the FP&A team shared a Google Sheet last quarter titled 'Q3 Budget Rollup'. Make a copy and update your tabs.",
    },
  ],
  "11": [
    {
      id: "11-1-user",
      sender: "user",
      text: "Do we provide monitors to new hires working remotely?",
    },
    {
      id: "11-2-bot",
      sender: "bot",
      text: "Yes. New hires can request up to two 24-inch monitors. Submit the equipment request form two weeks before their start date.",
    },
  ],
  "12": [
    {
      id: "12-1-user",
      sender: "user",
      text: "I missed last month’s security awareness refresher—how can I catch up?",
    },
    {
      id: "12-2-bot",
      sender: "bot",
      text: "The on-demand module is available in KnowBe4. Look for 'BH Security Refresher Q3' and complete it before the end of the month.",
    },
    {
      id: "12-3-user",
      sender: "user",
      text: "Do I need to notify anyone after I complete it?",
    },
    {
      id: "12-4-bot",
      sender: "bot",
      text: "Nope—the platform reports completion automatically to Compliance. Save your certificate in case your manager asks.",
    },
  ],
}

const STATIC_BOT_REPLY =
  "Thanks for reaching out! This is a placeholder response from the Knowledge Bot while we wire up the real service."

const markdownComponents = {
  a: ({ node, href, children, ...props }: any) => {
    const isAnchorLink = href?.startsWith("#")
    return (
      <a
        href={href}
        target={isAnchorLink ? undefined : "_blank"}
        rel={isAnchorLink ? undefined : "noreferrer"}
        className="font-medium text-primary underline underline-offset-4 transition hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    )
  },
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code
          className="rounded-md bg-accent/30 px-1.5 py-0.5 font-mono text-[0.925em] text-accent-foreground"
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <pre className="rounded-xl bg-accent/20 p-4 text-sm leading-6 text-foreground shadow-inner" {...props}>
        <code className={className}>{children}</code>
      </pre>
    )
  },
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  p: ({ children, ...props }: any) => (
    <p className="leading-relaxed" {...props}>
      {children}
    </p>
  ),
}

export function Dashboard({ onLogout, onNavigateToStats }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversationsList, setConversationsList] = useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ConversationMessage[]>
  >(initialMessagesByConversation)
  const [messageInput, setMessageInput] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  // Suggested follow-up questions - can be customized per conversation
  const suggestedQuestions = [
    "What's the PTO policy for this year?",
    "How do I submit an expense report?",
    "Where can I find client onboarding templates?",
    "What are the healthcare enrollment deadlines?",
  ]

  const handleSelectQuestion = (question: string) => {
    setMessageInput(question)
    setTimeout(() => {
      textareaRef.current?.focus()
      syncTextareaHeight(textareaRef.current)
    }, 0)
  }

  // Project management handlers
  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      conversationIds: [],
      files: [],
    }
    setProjects((prev) => [...prev, newProject])
    setShowCreateProjectDialog(false)
  }

  const handleAddConversationToProject = (projectId: string, conversationId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId && !project.conversationIds.includes(conversationId)) {
          return {
            ...project,
            conversationIds: [...project.conversationIds, conversationId],
            lastUpdated: Date.now(),
          }
        }
        return project
      }),
    )
  }

  const handleRemoveConversationFromProject = (projectId: string, conversationId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            conversationIds: project.conversationIds.filter((id) => id !== conversationId),
            lastUpdated: Date.now(),
          }
        }
        return project
      }),
    )
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId))
  }

  const handleAddFileToProject = (projectId: string, file: File) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: Date.now(),
    }
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            files: [...project.files, newFile],
            lastUpdated: Date.now(),
          }
        }
        return project
      }),
    )
  }

  const handleRemoveFileFromProject = (projectId: string, fileId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            files: project.files.filter((file) => file.id !== fileId),
            lastUpdated: Date.now(),
          }
        }
        return project
      }),
    )
  }

  // Get conversations that are not in any project
  const projectConversationIds = new Set(projects.flatMap((p) => p.conversationIds))
  const unorganizedConversations = conversationsList.filter((conv) => !projectConversationIds.has(conv.id))

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const syncTextareaHeight = useCallback((element: HTMLTextAreaElement | null) => {
    if (!element) {
      return
    }

    const maxHeight = 96 // 6rem (approx. 4 lines)
    element.style.height = "auto"
    const nextHeight = Math.min(element.scrollHeight, maxHeight)
    element.style.height = `${nextHeight}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [])

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

  useEffect(() => {
    syncTextareaHeight(textareaRef.current)
  }, [messageInput, activeConversationId, syncTextareaHeight])

  const filteredConversations = conversationsList.filter((conversation) => {
    const matchesSearch = conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesArchiveFilter = showArchived ? conversation.archived : !conversation.archived
    return matchesSearch && matchesArchiveFilter
  })

  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    if (!acc[conv.date]) {
      acc[conv.date] = []
    }
    acc[conv.date].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  const dateOrder = ["TODAY", "YESTERDAY", "PREVIOUS 7 DAYS"]
  
  const archivedConversations = conversationsList.filter((conv) => conv.archived)

  const activeConversation = conversationsList.find(
    (conversation) => conversation.id === activeConversationId,
  )

  const activeMessages = activeConversationId
    ? messagesByConversation[activeConversationId] ?? []
    : []

  const hasMessages = activeMessages.length > 0 || isBotTyping

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages, isBotTyping])

  const resetBotTyping = () => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current)
    }
    setIsBotTyping(false)
  }

  const handleAddSession = () => {
    const now = Date.now()
    const newConversation: Conversation = {
      id: now.toString(),
      title: "New Conversation",
      date: "TODAY",
      createdAt: now,
      lastUpdated: now,
      archived: false,
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

  const handleRenameConversation = (conversationId: string, newTitle: string) => {
    setConversationsList((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, title: newTitle, lastUpdated: Date.now() } : conv)),
    )
    setShowRenameDialog(false)
    setSelectedConversationId(null)
  }

  const handleDeleteConversation = (conversationId: string) => {
    setConversationsList((prev) => prev.filter((conv) => conv.id !== conversationId))
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
      setMessagesByConversation((prev) => {
        const updated = { ...prev }
        delete updated[conversationId]
        return updated
      })
    }
    setShowDeleteDialog(false)
    setSelectedConversationId(null)
  }

  const handleArchiveConversation = (conversationId: string) => {
    setConversationsList((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, archived: true, lastUpdated: Date.now() } : conv)),
    )
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
    }
  }

  const handleUnarchiveConversation = (conversationId: string) => {
    setConversationsList((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, archived: false, lastUpdated: Date.now() } : conv)),
    )
  }

  const selectedConversation = selectedConversationId
    ? conversationsList.find((c) => c.id === selectedConversationId)
    : null

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
    setTimeout(() => {
      syncTextareaHeight(textareaRef.current)
    }, 0)
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

  const renderComposer = (variant: "floating" | "docked") => {
    const baseClasses =
      variant === "floating"
        ? "mx-auto mt-6 flex w-full max-w-2xl items-end gap-4 rounded-full border border-border/40 bh-input-gradient px-5 py-3 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        : "mx-auto flex w-full max-w-3xl items-end gap-4 rounded-full border border-border/40 bh-input-gradient px-5 py-3 shadow-none backdrop-blur focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"

    const textareaId = variant === "floating" ? "composer-input-floating" : "composer-input-docked"
    const isEmpty = messageInput.trim().length === 0
    const labelText = isEmpty
      ? activeConversation
        ? "Ask Anything"
        : "Create a session to start chatting"
      : ""
    const labelTone = isEmpty
      ? activeConversation
        ? "text-muted-foreground"
        : "text-muted-foreground/60"
      : "text-muted-foreground"

    return (
      <div className="w-full">
        {suggestedQuestions.length > 0 && activeConversation && (
          <SuggestedQuestions 
            questions={suggestedQuestions} 
            onSelectQuestion={handleSelectQuestion}
            className="mb-4"
          />
        )}
        <form onSubmit={handleSendMessage} className={baseClasses}>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/15"
          aria-label="Add attachment"
          disabled={!activeConversation}
        >
          <Plus className="h-5 w-5" />
        </button>

        <div className="flex flex-1 flex-col gap-1">
          {labelText ? (
            <label htmlFor={textareaId} className={`text-xs font-semibold tracking-wide ${labelTone}`}>
              {labelText}
            </label>
          ) : null}
          <textarea
            ref={(node) => {
              textareaRef.current = node
              syncTextareaHeight(node)
            }}
            id={textareaId}
            rows={1}
            value={messageInput}
            onChange={(event) => {
              setMessageInput(event.target.value)
              syncTextareaHeight(event.currentTarget)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                if (activeConversation) {
                  event.currentTarget.form?.requestSubmit()
                }
              }
            }}
            placeholder=""
            disabled={!activeConversation}
            className="w-full resize-none overflow-y-hidden bg-transparent text-base text-foreground leading-relaxed placeholder:text-muted-foreground focus:outline-none max-h-24"
            style={{ minHeight: "2.5rem" }}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted disabled:opacity-50"
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
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-center">
            <div className="relative h-12 w-full flex-shrink-0">
              <Image
                src="/beaird-harris-logo.png"
                alt="Beaird Harris"
                width={300}
                height={69}
                className="h-12 w-full object-contain"
                priority
              />
            </div>
          </div>
          </div>

        <div className="px-4 pt-4">
          <div className="flex gap-2">
            <Button
              onClick={handleAddSession}
              className="flex-1 justify-center gap-2 rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              New session
            </Button>
            <Button
              onClick={() => setShowCreateProjectDialog(true)}
              variant="outline"
              className="px-4 border-border hover:bg-muted"
              title="Create Project"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Archive Toggle */}
        <div className="px-4 pt-2">
          <Button
            onClick={() => setShowArchived(!showArchived)}
            variant={showArchived ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? "Show Active" : `Archived (${archivedConversations.length})`}
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
            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Projects
                </h3>
                <div className="space-y-1">
                  {projects.map((project) => (
                    <ProjectFolder
                      key={project.id}
                      project={project}
                      conversations={conversationsList}
                      currentConversationId={activeConversationId || ""}
                      onSelectConversation={handleSelectConversation}
                      onRemoveConversation={handleRemoveConversationFromProject}
                      onDeleteProject={handleDeleteProject}
                      onAddFile={handleAddFileToProject}
                      onRemoveFile={handleRemoveFileFromProject}
                      onRenameConversation={(id) => {
                        setSelectedConversationId(id)
                        setShowRenameDialog(true)
                      }}
                      onDeleteConversation={(id) => {
                        setSelectedConversationId(id)
                        setShowDeleteDialog(true)
                      }}
                      onArchiveConversation={handleArchiveConversation}
                      onUnarchiveConversation={handleUnarchiveConversation}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Unorganized Conversations by Date */}
            {dateOrder.map((date) => {
              const dateConversations = groupedConversations[date]?.filter(
                (conv) => !projectConversationIds.has(conv.id),
              )
              if (!dateConversations || dateConversations.length === 0) return null

              return (
                <div key={date}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {dateConversations.map((conv) => {
                      const isActive = conv.id === activeConversationId
                      return (
                        <ChatHoverCard
                          key={conv.id}
                          metadata={{
                            createdAt: conv.createdAt,
                            lastUpdated: conv.lastUpdated,
                          }}
                        >
                          <div className="flex items-center group">
                            <button
                              type="button"
                              onClick={() => handleSelectConversation(conv.id)}
                              className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                                isActive ? "bg-muted" : "hover:bg-muted"
                              }`}
                            >
                              <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-foreground truncate">{conv.title}</span>
                              {conv.archived && (
                                <Archive className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </button>
                            <div className="flex items-center gap-1">
                              {projects.length > 0 && !showArchived && (
                                <ConversationMenu
                                  conversationId={conv.id}
                                  projects={projects}
                                  onAddToProject={handleAddConversationToProject}
                                />
                              )}
                              <ConversationActionsMenu
                                conversationId={conv.id}
                                conversationTitle={conv.title}
                                isArchived={conv.archived}
                                onRename={() => {
                                  setSelectedConversationId(conv.id)
                                  setShowRenameDialog(true)
                                }}
                                onDelete={() => {
                                  setSelectedConversationId(conv.id)
                                  setShowDeleteDialog(true)
                                }}
                                onArchive={() => handleArchiveConversation(conv.id)}
                                onUnarchive={() => handleUnarchiveConversation(conv.id)}
                              />
                            </div>
                          </div>
                        </ChatHoverCard>
                      )
                    })}
                  </div>
                </div>
              )
            })}
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
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
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
                {onNavigateToStats && (
                  <Button
                    onClick={() => {
                      onNavigateToStats()
                      setIsAccountMenuOpen(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-muted"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics & Stats
                  </Button>
                )}
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
                  className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="flex-1 px-8 py-10">
              <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-8">
                <div
                  className={`relative flex-1 ${
                    hasMessages ? "" : "flex items-center justify-center"
                  } min-h-[320px]`}
                >
                  {activeConversation ? (
                    hasMessages ? (
                      <div className="mx-auto w-full max-w-3xl space-y-5 px-1 pb-12">
                        {activeMessages.map((message) => {
                          const isUser = message.sender === "user"

                          if (isUser) {
                            return (
                              <div key={message.id} className="flex justify-end">
                                <div className="max-w-[70ch] rounded-3xl bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground shadow-sm">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                    className="markdown-content"
                                  >
                                    {message.text}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div key={message.id} className="flex justify-start">
                              <div className="w-full max-w-3xl px-6 py-5 text-base leading-relaxed text-foreground">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={markdownComponents}
                                  className="markdown-content"
                                >
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )
                        })}

                        {isBotTyping ? (
                          <div className="flex justify-start">
                            <div className="w-full max-w-3xl px-6 py-3 text-sm text-muted-foreground">
                              Knowledge Bot is drafting a response&hellip;
                            </div>
                          </div>
                        ) : null}
                        <div ref={messagesEndRef} />
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
                            Ask anything about Beaird Harris policies, processes, and resources to get started.
                          </p>
                        </div>
                        {renderComposer("floating")}
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

            {hasMessages ? <footer className="px-8 pb-10 pt-6">{renderComposer("docked")}</footer> : null}
          </div>
        </main>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        isOpen={showCreateProjectDialog}
        onClose={() => setShowCreateProjectDialog(false)}
        onCreate={handleCreateProject}
      />

      {/* Rename Conversation Dialog */}
      {selectedConversation && (
        <RenameConversationDialog
          isOpen={showRenameDialog}
          currentTitle={selectedConversation.title}
          onClose={() => {
            setShowRenameDialog(false)
            setSelectedConversationId(null)
          }}
          onRename={(newTitle) => handleRenameConversation(selectedConversation.id, newTitle)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedConversation && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          conversationTitle={selectedConversation.title}
          onClose={() => {
            setShowDeleteDialog(false)
            setSelectedConversationId(null)
          }}
          onDelete={() => handleDeleteConversation(selectedConversation.id)}
          onArchive={() => handleArchiveConversation(selectedConversation.id)}
          showArchiveOption={true}
        />
      )}
    </div>
  )
}

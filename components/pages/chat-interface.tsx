"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { type Project, type ProjectFile } from "@/components/project-folder"
import { RenameConversationDialog } from "@/components/rename-conversation-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

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
  archived?: boolean
}

export function ChatInterface({ selectedConversationId, onBack, onLogout }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "PTO Policy Inquiry",
      timestamp: Date.now() - 86400000,
      createdAt: Date.now() - 86400000,
      lastUpdated: Date.now() - 3600000,
      archived: false,
    },
    {
      id: "2",
      title: "Expense Report Guide",
      timestamp: Date.now() - 172800000,
      createdAt: Date.now() - 172800000,
      lastUpdated: Date.now() - 7200000,
      archived: false,
    },
    {
      id: "3",
      title: "Template for Client Onboarding",
      timestamp: Date.now() - 259200000,
      createdAt: Date.now() - 259200000,
      lastUpdated: Date.now() - 10800000,
      archived: false,
    },
    {
      id: "4",
      title: "2024 Tax Checklist",
      timestamp: Date.now() - 345600000,
      createdAt: Date.now() - 345600000,
      lastUpdated: Date.now() - 14400000,
      archived: false,
    },
  ])

  const [projects, setProjects] = useState<Project[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string>("new")
  const [messages, setMessages] = useState<Message[]>([])
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedConversationIdForAction, setSelectedConversationIdForAction] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  // Load messages based on selected conversation
  useEffect(() => {
    if (currentConversationId && currentConversationId !== "new") {
      if (currentConversationId === "1") {
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
  }, [currentConversationId])

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

  const handleRenameConversation = (conversationId: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, title: newTitle, lastUpdated: Date.now() } : conv)),
    )
    setShowRenameDialog(false)
    setSelectedConversationIdForAction(null)
  }

  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId("new")
      setMessages([])
    }
    setShowDeleteDialog(false)
    setSelectedConversationIdForAction(null)
  }

  const handleArchiveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, archived: true, lastUpdated: Date.now() } : conv)),
    )
    if (currentConversationId === conversationId) {
      setCurrentConversationId("new")
      setMessages([])
    }
  }

  const selectedConversationForAction = selectedConversationIdForAction
    ? conversations.find((c) => c.id === selectedConversationIdForAction)
    : null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        projects={projects}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onLogout={onLogout}
        onCreateProject={handleCreateProject}
        onAddConversationToProject={handleAddConversationToProject}
        onRemoveConversationFromProject={handleRemoveConversationFromProject}
        onDeleteProject={handleDeleteProject}
        onAddFileToProject={handleAddFileToProject}
        onRemoveFileFromProject={handleRemoveFileFromProject}
        onRenameConversation={(id) => {
          setSelectedConversationIdForAction(id)
          setShowRenameDialog(true)
        }}
        onDeleteConversation={(id) => {
          setSelectedConversationIdForAction(id)
          setShowDeleteDialog(true)
        }}
        onArchiveConversation={handleArchiveConversation}
        onUnarchiveConversation={(id) => {
          setConversations((prev) =>
            prev.map((conv) => (conv.id === id ? { ...conv, archived: false, lastUpdated: Date.now() } : conv)),
          )
        }}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />
      <ChatArea messages={messages} onSendMessage={handleSendMessage} suggestedQuestions={suggestedQuestions} />

      {/* Rename Conversation Dialog */}
      {selectedConversationForAction && (
        <RenameConversationDialog
          isOpen={showRenameDialog}
          currentTitle={selectedConversationForAction.title}
          onClose={() => {
            setShowRenameDialog(false)
            setSelectedConversationIdForAction(null)
          }}
          onRename={(newTitle) => handleRenameConversation(selectedConversationForAction.id, newTitle)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedConversationForAction && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          conversationTitle={selectedConversationForAction.title}
          onClose={() => {
            setShowDeleteDialog(false)
            setSelectedConversationIdForAction(null)
          }}
          onDelete={() => handleDeleteConversation(selectedConversationForAction.id)}
          onArchive={() => handleArchiveConversation(selectedConversationForAction.id)}
          showArchiveOption={true}
        />
      )}
    </div>
  )
}

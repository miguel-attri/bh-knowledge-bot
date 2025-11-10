"use client"

import { useState } from "react"
import { Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatHoverCard } from "@/components/chat-hover-card"

export interface ProjectFile {
  id: string
  name: string
  type: string
  size?: number
  uploadedAt: number
}

export interface Project {
  id: string
  name: string
  createdAt: number
  lastUpdated: number
  conversationIds: string[]
  files: ProjectFile[]
}

interface Conversation {
  id: string
  title: string
  timestamp: number
  createdAt: number
  lastUpdated: number
}

interface ProjectFolderProps {
  project: Project
  conversations: Conversation[]
  currentConversationId: string
  onSelectConversation: (id: string) => void
  onRemoveConversation?: (projectId: string, conversationId: string) => void
  onDeleteProject?: (projectId: string) => void
  onAddFile?: (projectId: string, file: File) => void
  onRemoveFile?: (projectId: string, fileId: string) => void
}

export function ProjectFolder({
  project,
  conversations,
  currentConversationId,
  onSelectConversation,
  onRemoveConversation,
  onDeleteProject,
  onAddFile,
  onRemoveFile,
}: ProjectFolderProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const projectConversations = conversations.filter((conv) => project.conversationIds.includes(conv.id))

  const fileInputId = `file-input-${project.id}`
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAddFile) {
      onAddFile(project.id, file)
    }
    // Reset input
    e.target.value = ""
  }

  return (
    <div className="mb-2">
      {/* Project Header */}
      <div className="flex items-center gap-2 group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground flex-1 truncate">{project.name}</span>
          <span className="text-xs text-muted-foreground">
            {projectConversations.length} {projectConversations.length === 1 ? "chat" : "chats"}
          </span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-10">
              <div className="p-1">
                <label className="block w-full">
                  <input
                    id={fileInputId}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    multiple={false}
                  />
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded"
                    onClick={() => document.getElementById(fileInputId)?.click()}
                  >
                    <File className="w-4 h-4 inline mr-2" />
                    Add File
                  </button>
                </label>
                {onDeleteProject && (
                  <button
                    onClick={() => {
                      onDeleteProject(project.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded"
                  >
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Content */}
      {isExpanded && (
        <div className="ml-6 space-y-1 mt-1">
          {/* Conversations */}
          {projectConversations.map((conversation) => (
            <ChatHoverCard
              key={conversation.id}
              metadata={{
                createdAt: conversation.createdAt,
                lastUpdated: conversation.lastUpdated,
              }}
            >
              <div className="flex items-center group/item">
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentConversationId === conversation.id ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <span className="text-sm text-foreground truncate">{conversation.title}</span>
                </button>
                {onRemoveConversation && (
                  <button
                    onClick={() => onRemoveConversation(project.id, conversation.id)}
                    className="p-1 rounded hover:bg-muted opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </ChatHoverCard>
          ))}

          {/* Files */}
          {project.files.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Files
              </div>
              {project.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-muted group/file"
                >
                  <File className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-foreground truncate flex-1">{file.name}</span>
                  {onRemoveFile && (
                    <button
                      onClick={() => onRemoveFile(project.id, file.id)}
                      className="p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover/file:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


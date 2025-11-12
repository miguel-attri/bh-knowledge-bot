"use client"

import { useState, useRef, useEffect } from "react"
import { Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatHoverCard } from "@/components/chat-hover-card"
import { ProjectConversationActionsMenu } from "@/components/project-conversation-actions-menu"

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
  archived?: boolean
}

interface ProjectFolderProps {
  project: Project
  conversations: Conversation[]
  currentConversationId: string
  activeProjectId?: string | null
  onSelectConversation: (id: string) => void
  onSelectProject?: (projectId: string) => void
  onRenameProject?: (projectId: string) => void
  onRemoveConversation?: (projectId: string, conversationId: string) => void
  onDeleteProject?: (projectId: string) => void
  onAddFile?: (projectId: string, file: File) => void
  onRemoveFile?: (projectId: string, fileId: string) => void
  onRenameConversation?: (conversationId: string) => void
  onDeleteConversation?: (conversationId: string) => void
  projects?: Project[]
  onAddToProject?: (projectId: string, conversationId: string) => void
}

export function ProjectFolder({
  project,
  conversations,
  currentConversationId,
  activeProjectId,
  onSelectConversation,
  onSelectProject,
  onRenameProject,
  onRemoveConversation,
  onDeleteProject,
  onAddFile,
  onRemoveFile,
  onRenameConversation,
  onDeleteConversation,
  projects = [],
  onAddToProject,
}: ProjectFolderProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const projectConversations = conversations.filter((conv) => project.conversationIds.includes(conv.id))

  const fileInputId = `file-input-${project.id}`

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAddFile) {
      onAddFile(project.id, file)
    }
    // Reset input
    e.target.value = ""
  }

  const isProjectActive = activeProjectId === project.id && !currentConversationId

  return (
    <div className="mb-2">
      {/* Project Header */}
      <div className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors group ${
        isProjectActive ? "bg-muted" : "hover:bg-muted"
      }`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 min-w-0 flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-primary flex-shrink-0" />
          )}
        </button>
        <button
          onClick={() => onSelectProject?.(project.id)}
          className="text-sm font-medium text-foreground flex-1 truncate min-w-0 text-left"
        >
          {project.name}
        </button>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-10">
              <div className="p-1">
                {onRenameProject && (
                  <button
                    onClick={() => {
                      onRenameProject(project.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Rename Project
                  </button>
                )}
                <div className="border-t border-border my-1" />
                {onDeleteProject && (
                  <button
                    onClick={() => {
                      onDeleteProject(project.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
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
        <div className="space-y-1 mt-1">
          {/* Conversations */}
          {projectConversations.map((conversation) => (
            <ChatHoverCard
              key={conversation.id}
              metadata={{
                createdAt: conversation.createdAt,
                lastUpdated: conversation.lastUpdated,
              }}
            >
              <div className={`flex items-center gap-3 rounded-lg px-3 py-2 transition group/item ${
                currentConversationId === conversation.id ? "bg-muted" : "hover:bg-muted"
              }`}>
                <div className="w-6 flex-shrink-0"></div>
                <button
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0"
                >
                  <span className="text-sm text-foreground truncate">{conversation.title}</span>
                </button>
                {(onRemoveConversation || onRenameConversation || onDeleteConversation) && (
                  <ProjectConversationActionsMenu
                    conversationId={conversation.id}
                    conversationTitle={conversation.title}
                    projectId={project.id}
                    projectName={project.name}
                    onRename={() => onRenameConversation?.(conversation.id)}
                    onDelete={() => onDeleteConversation?.(conversation.id)}
                    onRemoveFromProject={(projectId, conversationId) => onRemoveConversation?.(projectId, conversationId)}
                  />
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


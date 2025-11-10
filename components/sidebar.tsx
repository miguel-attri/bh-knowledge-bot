"use client"

import { useState } from "react"
import { Search, Plus, LogOut, Settings, MessageCircle, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChatHoverCard } from "@/components/chat-hover-card"
import { ProjectFolder, type Project, type ProjectFile } from "@/components/project-folder"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ConversationMenu } from "@/components/conversation-menu"
import { ConversationActionsMenu } from "@/components/conversation-actions-menu"
import { Archive } from "lucide-react"

interface Conversation {
  id: string
  title: string
  timestamp: number
  createdAt: number
  lastUpdated: number
  archived?: boolean
}

interface SidebarProps {
  conversations: Conversation[]
  projects?: Project[]
  currentConversationId: string
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onLogout?: () => void
  onCreateProject?: (name: string) => void
  onAddConversationToProject?: (projectId: string, conversationId: string) => void
  onRemoveConversationFromProject?: (projectId: string, conversationId: string) => void
  onDeleteProject?: (projectId: string) => void
  onAddFileToProject?: (projectId: string, file: File) => void
  onRemoveFileFromProject?: (projectId: string, fileId: string) => void
  onRenameConversation?: (conversationId: string) => void
  onDeleteConversation?: (conversationId: string) => void
  onArchiveConversation?: (conversationId: string) => void
  onUnarchiveConversation?: (conversationId: string) => void
  showArchived?: boolean
  onToggleArchived?: () => void
}

export function Sidebar({
  conversations,
  projects = [],
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onLogout,
  onCreateProject,
  onAddConversationToProject,
  onRemoveConversationFromProject,
  onDeleteProject,
  onAddFileToProject,
  onRemoveFileFromProject,
  onRenameConversation,
  onDeleteConversation,
  onArchiveConversation,
  onUnarchiveConversation,
  showArchived = false,
  onToggleArchived,
}: SidebarProps) {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Get conversations that are not in any project
  const projectConversationIds = new Set(projects.flatMap((p) => p.conversationIds))
  const unorganizedConversations = conversations.filter((conv) => !projectConversationIds.has(conv.id))

  // Filter conversations based on search and archive status
  const filteredUnorganized = unorganizedConversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesArchiveFilter = showArchived ? conv.archived : !conv.archived
    return matchesSearch && matchesArchiveFilter
  })

  const archivedCount = conversations.filter((conv) => conv.archived).length

  const handleCreateProject = (name: string) => {
    if (onCreateProject) {
      onCreateProject(name)
    }
    setShowCreateProjectDialog(false)
  }

  const handleAddFile = (projectId: string, file: File) => {
    if (onAddFileToProject) {
      onAddFileToProject(projectId, file)
    }
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="font-semibold text-foreground">Beard Harris Knowledge Bot</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onNewChat}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          {onCreateProject && (
            <Button
              onClick={() => setShowCreateProjectDialog(true)}
              variant="outline"
              className="px-4 border-border hover:bg-muted"
              title="Create Project"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Archive Toggle */}
      {onToggleArchived && (
        <div className="px-6 pt-2 pb-4">
          <Button
            onClick={onToggleArchived}
            variant={showArchived ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? "Show Active" : `Archived (${archivedCount})`}
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0 text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Content */}
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
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSelectConversation={onSelectConversation}
                    onRemoveConversation={onRemoveConversationFromProject}
                    onDeleteProject={onDeleteProject}
                    onAddFile={handleAddFile}
                    onRemoveFile={onRemoveFileFromProject}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unorganized Conversations */}
          {unorganizedConversations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Conversations
              </h3>
              <div className="space-y-1">
                {filteredUnorganized.map((conversation) => (
                  <ChatHoverCard
                    key={conversation.id}
                    metadata={{
                      createdAt: conversation.createdAt,
                      lastUpdated: conversation.lastUpdated,
                    }}
                  >
                    <div className="flex items-center group">
                      <button
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          currentConversationId === conversation.id ? "bg-muted" : "hover:bg-muted"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">{conversation.title}</span>
                        {conversation.archived && (
                          <Archive className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      <div className="flex items-center gap-1">
                        {onAddConversationToProject && projects.length > 0 && !showArchived && (
                          <ConversationMenu
                            conversationId={conversation.id}
                            projects={projects}
                            onAddToProject={onAddConversationToProject}
                          />
                        )}
                        {(onRenameConversation || onDeleteConversation || onArchiveConversation) && (
                          <ConversationActionsMenu
                            conversationId={conversation.id}
                            conversationTitle={conversation.title}
                            isArchived={conversation.archived}
                            onRename={() => onRenameConversation?.(conversation.id)}
                            onDelete={() => onDeleteConversation?.(conversation.id)}
                            onArchive={() => onArchiveConversation?.(conversation.id)}
                            onUnarchive={() => onUnarchiveConversation?.(conversation.id)}
                          />
                        )}
                      </div>
                    </div>
                  </ChatHoverCard>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {projects.length === 0 && unorganizedConversations.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a new chat to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* User Section & Bottom Actions */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10 bg-muted">
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold">
              AH
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Alex Hartman</p>
            <p className="text-xs text-muted-foreground">Beard Harris</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>

        <Button variant="ghost" size="sm" className="w-full justify-start text-foreground hover:bg-muted">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>

        {onLogout && (
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}
      </div>

      {/* Create Project Dialog */}
      {onCreateProject && (
        <CreateProjectDialog
          isOpen={showCreateProjectDialog}
          onClose={() => setShowCreateProjectDialog(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  )
}

"use client"

import { Search, Plus, LogOut, Settings, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Conversation {
  id: string
  title: string
  timestamp: number
}

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId: string
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onLogout?: () => void
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onLogout,
}: SidebarProps) {
  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="font-semibold text-foreground">Beard Harris Knowledge Bot</span>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations"
            className="pl-10 bg-muted border-0 text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                currentConversationId === conversation.id ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{conversation.title}</span>
            </button>
          ))}
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
    </div>
  )
}

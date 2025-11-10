"use client"

import { useState, useEffect } from "react"
import { Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RenameConversationDialogProps {
  isOpen: boolean
  currentTitle: string
  onClose: () => void
  onRename: (newTitle: string) => void
}

export function RenameConversationDialog({
  isOpen,
  currentTitle,
  onClose,
  onRename,
}: RenameConversationDialogProps) {
  const [newTitle, setNewTitle] = useState(currentTitle)

  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle)
    }
  }, [isOpen, currentTitle])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim() && newTitle.trim() !== currentTitle) {
      onRename(newTitle.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Rename Conversation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="conversation-title" className="block text-sm font-medium text-foreground mb-2">
              Conversation Title
            </label>
            <Input
              id="conversation-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter conversation title"
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newTitle.trim() || newTitle.trim() === currentTitle}>
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


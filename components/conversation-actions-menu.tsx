"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Edit, Trash2, Archive, ArchiveRestore } from "lucide-react"

interface ConversationActionsMenuProps {
  conversationId: string
  conversationTitle: string
  isArchived?: boolean
  onRename: () => void
  onDelete: () => void
  onArchive?: () => void
  onUnarchive?: () => void
}

export function ConversationActionsMenu({
  conversationId,
  conversationTitle,
  isArchived = false,
  onRename,
  onDelete,
  onArchive,
  onUnarchive,
}: ConversationActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-10">
          <div className="p-1">
            <button
              onClick={() => {
                onRename()
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Rename
            </button>
            {isArchived ? (
              onUnarchive && (
                <button
                  onClick={() => {
                    onUnarchive()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2"
                >
                  <ArchiveRestore className="w-4 h-4" />
                  Unarchive
                </button>
              )
            ) : (
              onArchive && (
                <button
                  onClick={() => {
                    onArchive()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )
            )}
            <div className="border-t border-border my-1" />
            <button
              onClick={() => {
                onDelete()
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


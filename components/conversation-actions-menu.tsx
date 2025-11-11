"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Edit, Trash2, FolderPlus } from "lucide-react"
import { type Project } from "@/components/project-folder"

interface ConversationActionsMenuProps {
  conversationId: string
  conversationTitle: string
  projects?: Project[]
  onRename: () => void
  onDelete: () => void
  onAddToProject?: (projectId: string, conversationId: string) => void
}

export function ConversationActionsMenu({
  conversationId,
  conversationTitle,
  projects = [],
  onRename,
  onDelete,
  onAddToProject,
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

  // Get projects that don't already contain this conversation
  const availableProjects = projects.filter((project) => !project.conversationIds.includes(conversationId))

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
            {availableProjects.length > 0 && onAddToProject && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Add to Project
                </div>
                {availableProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onAddToProject(project.id, conversationId)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    {project.name}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
              </>
            )}
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

"use client"

import { useState } from "react"
import { FolderPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
interface CreateProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export function CreateProjectDialog({ isOpen, onClose, onCreate }: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      onCreate(projectName.trim())
      setProjectName("")
      onClose()
    }
  }

  const projectSuggestions = [
    "Finance",
    "Healthcare",
    "Technology",
    "Marketing",
    "Operations",
    "HR",
    "Legal",
    "Sales",
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setProjectName(suggestion)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
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
            <label htmlFor="project-name" className="block text-sm font-medium text-foreground mb-2">
              Project Name
            </label>
            <Input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Q4 Marketing Campaign"
              className="w-full"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {projectSuggestions.map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(topic)}
                  className="px-4 py-2 text-sm text-foreground bg-muted hover:bg-muted/80 border border-border rounded-lg transition-colors text-left hover:border-primary/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!projectName.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


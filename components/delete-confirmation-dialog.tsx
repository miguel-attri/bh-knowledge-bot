"use client"

import { Trash2, X, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  conversationTitle: string
  onClose: () => void
  onDelete: () => void
  onArchive?: () => void
  showArchiveOption?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  conversationTitle,
  onClose,
  onDelete,
  onArchive,
  showArchiveOption = true,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Delete Conversation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground mb-4">
            Are you sure you want to delete <span className="font-semibold">"{conversationTitle}"</span>? This action
            cannot be undone.
          </p>
          {showArchiveOption && onArchive && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                For auditing purposes, you can archive this conversation instead of deleting it permanently.
              </p>
              <Button
                onClick={() => {
                  onArchive()
                  onClose()
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive Instead
              </Button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete()
                onClose()
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Permanently
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


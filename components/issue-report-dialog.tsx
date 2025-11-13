"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IssueReportDialogProps {
  isOpen: boolean
  onClose: () => void
  conversationId?: string
  conversationTitle?: string
}

export function IssueReportDialog({
  isOpen,
  onClose,
  conversationId,
  conversationTitle,
}: IssueReportDialogProps) {
  const [issueType, setIssueType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!issueType || !description.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/report-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueType,
          description,
          conversationId,
          conversationTitle,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form
        setIssueType("")
        setDescription("")
        // Close dialog after brief delay
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 1500)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Failed to submit issue report:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIssueType("")
      setDescription("")
      setSubmitStatus("idle")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Report an Issue</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {conversationTitle && (
            <div className="text-sm text-muted-foreground">
              Reporting issue for: <span className="font-medium text-foreground">{conversationTitle}</span>
            </div>
          )}

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select value={issueType} onValueChange={setIssueType} disabled={isSubmitting}>
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select an issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outdated">Outdated Information</SelectItem>
                <SelectItem value="incorrect">Incorrect Response</SelectItem>
                <SelectItem value="incomplete">Incomplete Answer</SelectItem>
                <SelectItem value="unclear">Unclear or Confusing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              Thank you! Your report has been submitted successfully.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              Failed to submit report. Please try again later.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!issueType || !description.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

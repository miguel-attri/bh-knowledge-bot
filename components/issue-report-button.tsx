"use client"

import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IssueReportButtonProps {
  onClick: () => void
}

export function IssueReportButton({ onClick }: IssueReportButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
      title="Report an issue"
      aria-label="Report an issue with the response"
    >
      <Flag className="h-5 w-5" />
    </Button>
  )
}

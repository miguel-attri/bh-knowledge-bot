"use client"

import { format } from "date-fns"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface ChatMetadata {
  createdAt: number
  lastUpdated: number
}

interface ChatHoverCardProps {
  children: React.ReactNode
  metadata: ChatMetadata
}

function formatSimpleDate(date: Date): string {
  return format(date, "MMM dd, yyyy")
}

export function ChatHoverCard({ children, metadata }: ChatHoverCardProps) {
  const createdAt = new Date(metadata.createdAt)
  const lastUpdated = new Date(metadata.lastUpdated)
  const createdDateStr = formatSimpleDate(createdAt)
  const lastUpdatedDateStr = formatSimpleDate(lastUpdated)
  const showLastUpdated = createdDateStr !== lastUpdatedDateStr

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-auto z-[100]"
        side="right"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col space-y-2">
          {showLastUpdated && (
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">Last Updated:</p>
              <p className="text-sm text-foreground">{lastUpdatedDateStr}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground">Created:</p>
            <p className="text-sm text-foreground">{createdDateStr}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}


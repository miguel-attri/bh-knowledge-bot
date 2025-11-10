"use client"

import { format, isToday, isTomorrow, isThisWeek, isYesterday } from "date-fns"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface ChatMetadata {
  createdAt: number
  lastUpdated: number
}

interface ChatHoverCardProps {
  children: React.ReactNode
  metadata: ChatMetadata
}

function formatRelativeDate(date: Date): string {
  const timeStr = format(date, "h:mm a")
  
  if (isToday(date)) {
    return `Today at ${timeStr}`
  }
  
  if (isTomorrow(date)) {
    return `Tomorrow at ${timeStr}`
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${timeStr}`
  }
  
  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return `This week, ${format(date, "EEEE 'at' h:mm a")}`
  }
  
  // For dates beyond this week, show full date
  return format(date, "MMM d, yyyy 'at' h:mm a")
}

export function ChatHoverCard({ children, metadata }: ChatHoverCardProps) {
  const createdAt = new Date(metadata.createdAt)
  const lastUpdated = new Date(metadata.lastUpdated)

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-64 z-[100]" 
        side="right" 
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Created</p>
            <p className="text-sm text-foreground">{formatRelativeDate(createdAt)}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
            <p className="text-sm text-foreground">{formatRelativeDate(lastUpdated)}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}


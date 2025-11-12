"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChatView } from "@/components/chat-view"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  const handleNavigateToStats = () => {
    router.push("/analytics")
  }

  return (
    <ChatView
      onLogout={handleLogout}
      onNavigateToStats={handleNavigateToStats}
      initialConversationId={conversationId}
    />
  )
}

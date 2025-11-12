"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dashboard } from "@/components/features/dashboard/dashboard"

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

  // For now, we pass the conversation ID to the Dashboard component
  // In a future refactor, we'll extract the chat view into its own component
  return (
    <Dashboard
      onLogout={handleLogout}
      onNavigateToStats={handleNavigateToStats}
      initialConversationId={conversationId}
    />
  )
}

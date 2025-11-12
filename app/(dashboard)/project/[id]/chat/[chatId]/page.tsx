"use client"

import { useParams, useRouter } from "next/navigation"
import { ChatView } from "@/components/chat-view"

export default function ProjectChatPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const chatId = params.chatId as string

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
      initialProjectId={projectId}
      initialConversationId={chatId}
    />
  )
}

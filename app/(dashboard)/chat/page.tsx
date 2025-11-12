"use client"

import { ChatView } from "@/components/chat-view"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

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
    />
  )
}

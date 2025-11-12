"use client"

import { Dashboard } from "@/components/features/dashboard/dashboard"
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
    <Dashboard
      onLogout={handleLogout}
      onNavigateToStats={handleNavigateToStats}
    />
  )
}

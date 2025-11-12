"use client"

import { Stats } from "@/components/features/analytics/stats"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  return <Stats onBack={handleBack} onLogout={handleLogout} />
}

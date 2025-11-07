"use client"

import { useState, useEffect } from "react"
import { Login } from "@/components/pages/login"
import { Dashboard } from "@/components/pages/dashboard"

type AppPage = "login" | "dashboard"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount (simulate with localStorage)
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      setCurrentPage("dashboard")
    }
  }, [])

  const handleLogin = (email: string) => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    setCurrentPage("login")
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard onLogout={handleLogout} />
}

"use client"

import { Login } from "@/components/features/auth/login"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (email: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    router.push("/dashboard")
  }

  return <Login onLogin={handleLogin} />
}

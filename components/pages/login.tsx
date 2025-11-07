"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

interface LoginProps {
  onLogin: (email: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleMicrosoftSignIn = () => {
    setIsLoading(true)
    // Simulate Microsoft 365 sign-in
    setTimeout(() => {
      onLogin("alex.hartman@beardharris.com")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-12">
        <div className="text-2xl font-bold text-primary">
          <span className="inline-block">BEAIRD</span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground text-balance">Welcome to the Beard Harris Knowledge Bot</h1>
          <p className="text-lg text-muted-foreground">Please sign in using your Microsoft account to continue.</p>
        </div>

        {/* Sign In Button */}
        <Button
          onClick={handleMicrosoftSignIn}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-semibold rounded-lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          {isLoading ? "Signing in..." : "Sign in with Microsoft 365"}
        </Button>

        {/* Support Link */}
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            Contact IT Support
          </a>
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">BH</span>
            </div>
            <div>
              <div className="text-lg font-bold leading-tight bh-gradient-text">Beaird Harris</div>
              <div className="text-xs text-muted-foreground">Knowledge Bot</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo/Brand Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight bh-gradient-text">
              Welcome to Beaird Harris
            </h1>
            <p className="text-xl text-muted-foreground font-light">
              Knowledge Bot
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Sign in to continue
              </h2>
              <p className="text-muted-foreground">
                Use your Microsoft 365 account to access the Knowledge Bot
              </p>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleMicrosoftSignIn}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#005075] text-primary-foreground h-14 text-base font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <div className="flex items-center mr-2">
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <div className="bg-[#F25022] rounded-tl-sm"></div>
                      <div className="bg-[#7FBA00] rounded-tr-sm"></div>
                      <div className="bg-[#00A4EF] rounded-bl-sm"></div>
                      <div className="bg-[#FFB900] rounded-br-sm"></div>
                    </div>
                  </div>
                  Sign in with Microsoft 365
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Support Link */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                Need help?{" "}
                <a href="#" className="text-primary hover:text-[#005075] hover:underline font-medium transition-colors">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            Beaird Harris Knowledge Bot • Secure Access Required
          </p>
        </div>
      </div>
    </div>
  )
}

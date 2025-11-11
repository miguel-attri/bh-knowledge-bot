"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { TrendingUp, BarChart3, Filter, ChevronDown, ChevronRight, ChevronLeft, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface StatsProps {
  onBack: () => void
  onLogout?: () => void
}

interface QuestionStat {
  id: string
  question: string
  count: number
  category: string
  lastAsked: number
}

interface TopicStat {
  id: string
  topic: string
  count: number
  trend: "up" | "down" | "stable"
  change: number
}

// Mock data - in production, this would come from an API
const mockQuestions: QuestionStat[] = [
  { id: "1", question: "How do I submit an expense report?", count: 45, category: "Finance", lastAsked: Date.now() - 3600000 },
  { id: "2", question: "What's the PTO policy for this year?", count: 38, category: "HR", lastAsked: Date.now() - 7200000 },
  { id: "3", question: "Where can I find client onboarding templates?", count: 32, category: "Operations", lastAsked: Date.now() - 10800000 },
  { id: "4", question: "What are the healthcare enrollment deadlines?", count: 28, category: "HR", lastAsked: Date.now() - 14400000 },
  { id: "5", question: "How do I request IT support for a new laptop?", count: 24, category: "IT", lastAsked: Date.now() - 18000000 },
  { id: "6", question: "What's the process for quarterly budget updates?", count: 21, category: "Finance", lastAsked: Date.now() - 21600000 },
  { id: "7", question: "Where can I find the employee travel policy?", count: 19, category: "HR", lastAsked: Date.now() - 25200000 },
  { id: "8", question: "How do I access the knowledge base?", count: 17, category: "General", lastAsked: Date.now() - 28800000 },
]

const mockTopics: TopicStat[] = [
  { id: "1", topic: "Expense Reporting", count: 89, trend: "up", change: 12 },
  { id: "2", topic: "PTO & Time Off", count: 76, trend: "up", change: 8 },
  { id: "3", topic: "Client Onboarding", count: 64, trend: "stable", change: 0 },
  { id: "4", topic: "Healthcare Benefits", count: 52, trend: "down", change: -5 },
  { id: "5", topic: "IT Support", count: 48, trend: "up", change: 15 },
  { id: "6", topic: "Budget & Finance", count: 41, trend: "stable", change: 2 },
  { id: "7", topic: "Travel Policy", count: 35, trend: "up", change: 7 },
  { id: "8", topic: "401(k) Contributions", count: 28, trend: "down", change: -3 },
]

export function Stats({ onBack, onLogout }: StatsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false)
      }
    }

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isAccountMenuOpen])

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  const timeRanges: { value: "7d" | "30d" | "90d" | "all"; label: string }[] = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "all", label: "All Time" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="relative h-12 w-full flex-shrink-0">
            <Image
              src="/beaird-harris-logo.png"
              alt="Beaird Harris"
              width={300}
              height={69}
              className="h-12 w-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Time Range
                </label>
                <div className="space-y-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        timeRange === range.value
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">Analytics & Insights</h1>
            </div>
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <Avatar className="h-8 w-8 bg-muted">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    AH
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-foreground">Alex Hartman</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute right-0 z-10 mt-3 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-muted"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  {onLogout && (
                    <Button
                      onClick={onLogout}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Trending Topics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Trending Topics</h2>
              </div>
              <div className="space-y-4">
                {mockTopics.map((topic) => {
                  const isExpanded = expandedTopics.has(topic.id)
                  const topicQuestions = mockQuestions.filter((q) =>
                    q.question.toLowerCase().includes(topic.topic.toLowerCase().split(" ")[0].toLowerCase())
                  )

                  return (
                    <div key={topic.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-muted">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className="flex items-center justify-center w-6 h-6 hover:bg-background rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-semibold text-foreground">{topic.topic}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  topic.trend === "up"
                                    ? "bg-green-100 text-green-700"
                                    : topic.trend === "down"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {topic.trend === "up" ? "↑" : topic.trend === "down" ? "↓" : "→"} {Math.abs(topic.change)}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{topic.count} questions asked</p>
                          </div>
                        </div>
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      {isExpanded && topicQuestions.length > 0 && (
                        <div className="p-4 bg-background border-t border-border">
                          <div className="space-y-3">
                            {topicQuestions.map((question, index) => (
                              <div key={question.id} className="flex items-start gap-4 p-3 bg-muted rounded-lg">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">#{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">{question.question}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-muted-foreground">{question.count} times asked</span>
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{question.category}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


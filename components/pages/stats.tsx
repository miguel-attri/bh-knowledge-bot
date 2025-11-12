"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { TrendingUp, Filter, ChevronDown, ChevronRight, ChevronLeft, LogOut, Settings } from "lucide-react"
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

interface ConversationThread {
  id: string
  title: string
  firstMessage: string
  date: number
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

// Mock conversation threads - anonymized chat threads for each topic
const mockThreadsByTopic: Record<string, ConversationThread[]> = {
  "1": [
    { id: "t1-1", title: "Expense Report Submission Process", firstMessage: "How do I submit an expense report for client travel?", date: Date.now() - 3600000 },
    { id: "t1-2", title: "Receipt Requirements", firstMessage: "What supporting documents are required for expense reporting?", date: Date.now() - 7200000 },
    { id: "t1-3", title: "Expense Report Deadline", firstMessage: "Is there a deadline for submitting receipts after travel?", date: Date.now() - 10800000 },
    { id: "t1-4", title: "Reimbursement Timeline", firstMessage: "How long does it take to get reimbursed for expenses?", date: Date.now() - 14400000 },
    { id: "t1-5", title: "Mileage Reimbursement", firstMessage: "What's the current mileage reimbursement rate?", date: Date.now() - 18000000 },
    { id: "t1-6", title: "International Expense Reporting", firstMessage: "How do I handle expenses in foreign currency?", date: Date.now() - 21600000 },
    { id: "t1-7", title: "Corporate Card Policy", firstMessage: "Can I use my corporate card for client dinners?", date: Date.now() - 25200000 },
    { id: "t1-8", title: "Per Diem Rates", firstMessage: "What are the per diem rates for overnight travel?", date: Date.now() - 28800000 },
    { id: "t1-9", title: "Lost Receipt Protocol", firstMessage: "What should I do if I lost a receipt?", date: Date.now() - 32400000 },
    { id: "t1-10", title: "Expense Categories", firstMessage: "What expense categories should I use for supplies?", date: Date.now() - 36000000 },
  ],
  "2": [
    { id: "t2-1", title: "PTO Balance Check", firstMessage: "Can you clarify how many PTO days I have left this year?", date: Date.now() - 1800000 },
    { id: "t2-2", title: "PTO Policy Details", firstMessage: "What's the PTO policy for this year?", date: Date.now() - 5400000 },
    { id: "t2-3", title: "Rollover Policy", firstMessage: "Do unused PTO days roll over to next year?", date: Date.now() - 9000000 },
    { id: "t2-4", title: "Holiday Schedule", firstMessage: "What are the company holidays for this year?", date: Date.now() - 12600000 },
    { id: "t2-5", title: "Sick Leave Policy", firstMessage: "How many sick days do I get per year?", date: Date.now() - 16200000 },
    { id: "t2-6", title: "PTO Request Process", firstMessage: "How far in advance should I request time off?", date: Date.now() - 19800000 },
    { id: "t2-7", title: "Bereavement Leave", firstMessage: "What's the policy for bereavement leave?", date: Date.now() - 23400000 },
    { id: "t2-8", title: "Parental Leave", firstMessage: "How much parental leave is offered?", date: Date.now() - 27000000 },
  ],
  "3": [
    { id: "t3-1", title: "Onboarding Template Request", firstMessage: "Do we have a standardized client onboarding template?", date: Date.now() - 2700000 },
    { id: "t3-2", title: "Client Kickoff Materials", firstMessage: "Where can I find client onboarding templates?", date: Date.now() - 6300000 },
    { id: "t3-3", title: "Onboarding Checklist", firstMessage: "What's included in the client onboarding process?", date: Date.now() - 9900000 },
    { id: "t3-4", title: "Client Welcome Package", firstMessage: "What materials should I send to new clients?", date: Date.now() - 13500000 },
    { id: "t3-5", title: "First Meeting Agenda", firstMessage: "What should be covered in the initial client meeting?", date: Date.now() - 17100000 },
    { id: "t3-6", title: "Onboarding Timeline", firstMessage: "How long does the typical onboarding process take?", date: Date.now() - 20700000 },
  ],
  "4": [
    { id: "t4-1", title: "Healthcare Enrollment Deadlines", firstMessage: "What are the healthcare enrollment deadlines?", date: Date.now() - 4500000 },
    { id: "t4-2", title: "Benefits Package Overview", firstMessage: "Can you explain the healthcare benefits options?", date: Date.now() - 8100000 },
    { id: "t4-3", title: "Dependent Coverage", firstMessage: "How do I add a dependent to my healthcare plan?", date: Date.now() - 11700000 },
    { id: "t4-4", title: "HSA vs FSA", firstMessage: "What's the difference between HSA and FSA?", date: Date.now() - 15300000 },
    { id: "t4-5", title: "Dental Coverage", firstMessage: "Does the plan include dental coverage?", date: Date.now() - 18900000 },
  ],
  "5": [
    { id: "t5-1", title: "New Laptop Request", firstMessage: "How do I request IT support for a new laptop?", date: Date.now() - 3300000 },
    { id: "t5-2", title: "Software Installation", firstMessage: "Who do I contact for software installation help?", date: Date.now() - 6900000 },
    { id: "t5-3", title: "VPN Access Issues", firstMessage: "I'm having trouble connecting to the VPN", date: Date.now() - 10500000 },
    { id: "t5-4", title: "Password Reset", firstMessage: "How do I reset my network password?", date: Date.now() - 14100000 },
    { id: "t5-5", title: "Email Access Problem", firstMessage: "I can't access my email on my phone", date: Date.now() - 17700000 },
    { id: "t5-6", title: "Printer Setup", firstMessage: "How do I connect to the office printer?", date: Date.now() - 21300000 },
    { id: "t5-7", title: "Monitor Request", firstMessage: "Can I request an additional monitor for my desk?", date: Date.now() - 24900000 },
  ],
}

export function Stats({ onBack, onLogout }: StatsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [visibleThreadCounts, setVisibleThreadCounts] = useState<Record<string, number>>({})
  const [visibleTopicsCount, setVisibleTopicsCount] = useState(5)
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
        // Initialize visible count to 5 when expanding
        if (!visibleThreadCounts[topicId]) {
          setVisibleThreadCounts((prevCounts) => ({
            ...prevCounts,
            [topicId]: 5,
          }))
        }
      }
      return newSet
    })
  }

  const loadMoreThreads = (topicId: string) => {
    setVisibleThreadCounts((prevCounts) => ({
      ...prevCounts,
      [topicId]: (prevCounts[topicId] || 5) + 5,
    }))
  }

  const loadMoreTopics = () => {
    setVisibleTopicsCount((prev) => prev + 5)
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
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-center">
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
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Filters */}
            <div className="space-y-3">
              {/* <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div> */}

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Time Range
                </label>
                <div className="space-y-1">
                  {timeRanges.map((range) => (
                    <div key={range.value}>
                      <button
                        onClick={() => setTimeRange(range.value)}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                          timeRange === range.value
                            ? "bg-muted"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="text-sm text-foreground truncate">{range.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 border-b border-border bg-card px-8 h-20 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted"
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

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Trending Topics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Top Topics</h2>
              </div>
              <div className="space-y-4">
                {mockTopics.slice(0, visibleTopicsCount).map((topic) => {
                  const isExpanded = expandedTopics.has(topic.id)
                  const allThreads = mockThreadsByTopic[topic.id] || []
                  const visibleCount = visibleThreadCounts[topic.id] || 5
                  const visibleThreads = allThreads.slice(0, visibleCount)
                  const hasMore = allThreads.length > visibleCount

                  return (
                    <div key={topic.id} className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full flex items-center justify-between p-4 bg-background hover:bg-muted border border-border rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-6 h-6">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex gap-4 justify-between w-full">
                            <span className="text-lg font-semibold text-foreground">{topic.topic}</span>
                            <p className="text-sm text-muted-foreground mt-1">{topic.count} questions asked</p>
                          </div>
                        </div>
                      </button>
                      {isExpanded && allThreads.length > 0 && (
                        <div>
                          <div className="divide-y divide-border">
                            {visibleThreads.map((thread) => (
                              <button
                                key={thread.id}
                                className="w-full text-left px-4 py-4 transition flex items-start justify-between gap-4 hover:bg-muted"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground mb-1">{thread.title}</div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {thread.firstMessage}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground flex-shrink-0">
                                  {new Date(thread.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </button>
                            ))}
                          </div>
                          {hasMore && (
                            <div className="p-4 border-t border-border flex justify-end">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  loadMoreThreads(topic.id)
                                }}
                                variant="outline"
                                className="hover:bg-muted"
                              >
                                Show more
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {visibleTopicsCount < mockTopics.length && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={loadMoreTopics}
                    variant="outline"
                    className="hover:bg-muted"
                  >
                    Show more
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


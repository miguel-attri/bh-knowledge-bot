"use client"

import { useState } from "react"
import { TrendingUp, MessageSquare, FileText, BarChart3, Filter, Users } from "lucide-react"
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

interface DocumentationGap {
  id: string
  topic: string
  questionCount: number
  urgency: "high" | "medium" | "low"
  relatedQuestions: string[]
}

type StaffGrade = "all" | "associate" | "senior" | "manager" | "director"

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

const mockDocumentationGaps: DocumentationGap[] = [
  {
    id: "1",
    topic: "Remote Work Equipment",
    questionCount: 15,
    urgency: "high",
    relatedQuestions: [
      "What equipment is provided for remote workers?",
      "How do I request a monitor for home office?",
      "What's the process for returning equipment?",
    ],
  },
  {
    id: "2",
    topic: "Client Communication Templates",
    questionCount: 12,
    urgency: "medium",
    relatedQuestions: [
      "Where are email templates for client updates?",
      "What's the standard response time for client inquiries?",
      "How do I customize client communication templates?",
    ],
  },
  {
    id: "3",
    topic: "Performance Review Process",
    questionCount: 9,
    urgency: "medium",
    relatedQuestions: [
      "When are performance reviews conducted?",
      "What documents are needed for performance reviews?",
      "How do I access my performance review history?",
    ],
  },
  {
    id: "4",
    topic: "Software License Management",
    questionCount: 7,
    urgency: "low",
    relatedQuestions: [
      "How do I request a new software license?",
      "What software is available for employees?",
      "Who manages software license renewals?",
    ],
  },
]

export function Stats({ onBack, onLogout }: StatsProps) {
  const [selectedGrade, setSelectedGrade] = useState<StaffGrade>("all")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  const staffGrades: { value: StaffGrade; label: string }[] = [
    { value: "all", label: "All Staff" },
    { value: "associate", label: "Associate" },
    { value: "senior", label: "Senior" },
    { value: "manager", label: "Manager" },
    { value: "director", label: "Director" },
  ]

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
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-foreground">Beard Harris Knowledge Bot</span>
          </div>
          <Button onClick={onBack} variant="outline" className="w-full">
            ← Back to Chat
          </Button>
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
                  Staff Grade
                </label>
                <div className="space-y-1">
                  {staffGrades.map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => setSelectedGrade(grade.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGrade === grade.value
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
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

        {/* User Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10 bg-muted">
              <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold">
                AH
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Alex Hartman</p>
              <p className="text-xs text-muted-foreground">Beard Harris</p>
            </div>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Analytics & Insights</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track hot topics, frequently asked questions, and documentation gaps
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Data is anonymized and aggregated</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {mockQuestions.reduce((sum, q) => sum + q.count, 0)}
                    </p>
                  </div>
                  <MessageSquare className="w-12 h-12 text-primary opacity-20" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hot Topics</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{mockTopics.length}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-primary opacity-20" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documentation Gaps</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{mockDocumentationGaps.length}</p>
                  </div>
                  <FileText className="w-12 h-12 text-primary opacity-20" />
                </div>
              </div>
            </div>

            {/* Hot Topics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Hot Topics</h2>
              </div>
              <div className="space-y-4">
                {mockTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
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
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {mockQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{question.question}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">{question.count} times asked</span>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{question.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas Needing Documentation */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Areas Needing More Documentation</h2>
              </div>
              <div className="space-y-4">
                {mockDocumentationGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className={`p-4 rounded-lg border ${
                      gap.urgency === "high"
                        ? "bg-red-50 border-red-200"
                        : gap.urgency === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{gap.topic}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {gap.questionCount} related questions asked
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          gap.urgency === "high"
                            ? "bg-red-100 text-red-700"
                            : gap.urgency === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {gap.urgency.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Sample Questions:</p>
                      <ul className="space-y-1">
                        {gap.relatedQuestions.slice(0, 3).map((q, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


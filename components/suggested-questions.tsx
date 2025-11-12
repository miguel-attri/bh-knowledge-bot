"use client"

import { Sparkles } from "lucide-react"

interface SuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
  className?: string
}

export function SuggestedQuestions({ questions, onSelectQuestion, className = "" }: SuggestedQuestionsProps) {
  if (questions.length === 0) {
    return null
  }

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="flex items-center gap-2 mb-3 px-2">
        <Sparkles className="w-4 h-4 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested Follow-ups</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="px-4 py-2 text-sm text-foreground bg-muted hover:bg-muted/80 border border-border rounded-lg transition-colors text-left hover:border-primary/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}


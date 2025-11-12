import { Conversation, ConversationMessage } from "./types"

const now = Date.now()

export const initialConversations: Conversation[] = [
  { id: "1", title: "PTO Policy Inquiry", date: "TODAY", timestamp: now - 1800000, createdAt: now - 3600000, lastUpdated: now - 1800000 },
  { id: "2", title: "Template for Client Onboarding", date: "TODAY", timestamp: now - 3600000, createdAt: now - 7200000, lastUpdated: now - 3600000 },
  { id: "3", title: "Expense Reporting Guidelines", date: "YESTERDAY", timestamp: now - 169200000, createdAt: now - 172800000, lastUpdated: now - 169200000 },
  { id: "4", title: "401(k) Contribution Limits", date: "YESTERDAY", timestamp: now - 165600000, createdAt: now - 172800000, lastUpdated: now - 165600000 },
  { id: "5", title: "Continuing Education Policy", date: "PREVIOUS 7 DAYS", timestamp: now - 504000000, createdAt: now - 518400000, lastUpdated: now - 504000000 },
  { id: "6", title: "Marketing Material Request", date: "PREVIOUS 7 DAYS", timestamp: now - 576000000, createdAt: now - 604800000, lastUpdated: now - 576000000 },
  { id: "7", title: "IT Support for New Laptop", date: "PREVIOUS 7 DAYS", timestamp: now - 648000000, createdAt: now - 691200000, lastUpdated: now - 648000000 },
  { id: "8", title: "Employee Travel Reimbursement", date: "PREVIOUS 7 DAYS", timestamp: now - 720000000, createdAt: now - 777600000, lastUpdated: now - 720000000 },
  { id: "9", title: "Healthcare Enrollment Follow-up", date: "PREVIOUS 7 DAYS", timestamp: now - 792000000, createdAt: now - 864000000, lastUpdated: now - 792000000 },
  { id: "10", title: "Quarterly Budget Guidelines", date: "OLDER", timestamp: now - 864000000, createdAt: now - 950400000, lastUpdated: now - 864000000 },
  { id: "11", title: "New Hire Equipment Checklist", date: "OLDER", timestamp: now - 936000000, createdAt: now - 1036800000, lastUpdated: now - 936000000 },
  { id: "12", title: "Security Awareness Refresher", date: "OLDER", timestamp: now - 1008000000, createdAt: now - 1123200000, lastUpdated: now - 1008000000 },
]

export const initialMessagesByConversation: Record<string, ConversationMessage[]> = {
  "1": [
    {
      id: "1-1-user",
      sender: "user",
      text: "Can you clarify how many PTO days I have left this year?",
    },
    {
      id: "1-2-bot",
      sender: "bot",
      text: "Sure thing! Full-time employees accrue 15 days annually. You currently have 7 days remaining in your balance.",
    },
    {
      id: "1-3-user",
      sender: "user",
      text: "Great, thanks! Do unused days roll over?",
    },
    {
      id: "1-4-bot",
      sender: "bot",
      text: "Unused days do not roll over, but you can request to cash out up to 5 days before December 15th.",
    },
  ],
  "2": [
    {
      id: "2-1-user",
      sender: "user",
      text: "Do we have a standardized client onboarding template I can use for new engagements?",
    },
    {
      id: "2-2-bot",
      sender: "bot",
      text: "Yes! Check the Knowledge Library under Sales Enablement → Client Experience. The 'BH Onboarding Playbook' includes slides, email copy, and a kickoff checklist.",
    },
    {
      id: "2-3-user",
      sender: "user",
      text: "Is it okay to customize the slide deck?",
    },
    {
      id: "2-4-bot",
      sender: "bot",
      text: "Absolutely—just keep the first three intro slides intact and update the timeline to match the client scope.",
    },
  ],
  "3": [
    {
      id: "3-1-user",
      sender: "user",
      text: "What supporting documents are required for expense reporting?",
    },
    {
      id: "3-2-bot",
      sender: "bot",
      text: "Receipts are needed for any expense over $25. Please include the client or project code when you submit.",
    },
    {
      id: "3-3-user",
      sender: "user",
      text: "Is there a deadline for submitting receipts after travel?",
    },
    {
      id: "3-4-bot",
      sender: "bot",
      text: "Yes, please submit within 14 days of your travel end date so Accounting can close the period on time.",
    },
  ],
  "4": [
    {
      id: "4-1-user",
      sender: "user",
      text: "What is the current 401(k) company match?",
    },
    {
      id: "4-2-bot",
      sender: "bot",
      text: "Beaird Harris matches 50% of your contributions up to 6% of eligible compensation.",
    },
    {
      id: "4-3-user",
      sender: "user",
      text: "When can I change my contribution percentage?",
    },
    {
      id: "4-4-bot",
      sender: "bot",
      text: "You can update it anytime through Principal's online portal. Changes typically take effect on the next payroll cycle.",
    },
  ],
  "5": [
    {
      id: "5-1-user",
      sender: "user",
      text: "Does the firm reimburse continuing education?",
    },
    {
      id: "5-2-bot",
      sender: "bot",
      text: "Yes—up to $2,000 annually for job-related courses, certifications, or conferences. Get manager approval before registering.",
    },
  ],
}

export const STATIC_BOT_REPLY =
  "Thanks for reaching out! This is a placeholder response from the Knowledge Bot while we wire up the real service."

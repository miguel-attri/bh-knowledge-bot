export interface Conversation {
  id: string
  title: string
  date: string
  timestamp: number
  createdAt: number
  lastUpdated: number
  archived?: boolean
}

export interface ConversationMessage {
  id: string
  sender: "user" | "bot"
  text: string
}

export interface Project {
  id: string
  name: string
  conversationIds: string[]
  files?: ProjectFile[]
  createdAt: number
}

export interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: number
}

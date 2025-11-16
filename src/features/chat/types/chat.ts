import { z } from 'zod'

// Message Role
export const messageRoleSchema = z.enum(['user', 'assistant', 'system'])
export type MessageRole = z.infer<typeof messageRoleSchema>

// Message Status
export const messageStatusSchema = z.enum(['sending', 'sent', 'error', 'streaming'])
export type MessageStatus = z.infer<typeof messageStatusSchema>

// Chat Message
export const chatMessageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  timestamp: z.string(),
  status: messageStatusSchema.optional(),
  error: z.string().optional(),
  invoiceContext: z
    .object({
      jobId: z.string(),
      invoiceNumber: z.string().optional(),
      carrier: z.string().optional(),
    })
    .optional(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>

// Chat Session
export const chatSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(chatMessageSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  invoiceContext: z
    .object({
      jobId: z.string().optional(),
      invoiceNumber: z.string().optional(),
      carrier: z.string().optional(),
    })
    .optional(),
})
export type ChatSession = z.infer<typeof chatSessionSchema>

// API Request/Response Types
export interface SendMessageRequest {
  message: string
  sessionId?: string
  invoiceContext?: {
    jobId?: string
    invoiceNumber?: string
    carrier?: string
  }
  stream?: boolean
}

export interface SendMessageResponse {
  success: boolean
  data: {
    messageId: string
    sessionId: string
    response: string
    timestamp: string
  }
  error?: {
    message: string
    code?: string
  }
}

export interface StreamChunk {
  type: 'start' | 'content' | 'end' | 'error'
  content?: string
  messageId?: string
  sessionId?: string
  error?: string
}

export interface GetSessionsResponse {
  success: boolean
  data: {
    sessions: ChatSession[]
  }
}

export interface GetSessionResponse {
  success: boolean
  data: {
    session: ChatSession
  }
}

export interface CreateSessionRequest {
  title?: string
  invoiceContext?: {
    jobId?: string
    invoiceNumber?: string
    carrier?: string
  }
}

export interface CreateSessionResponse {
  success: boolean
  data: {
    sessionId: string
    session: ChatSession
  }
}

import axios from 'axios'
import type {
  SendMessageRequest,
  SendMessageResponse,
  GetSessionsResponse,
  GetSessionResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  StreamChunk,
} from '../types/chat'

// Base URL for the Chat API
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL || '/api/v1/chat'

/**
 * Send a message to the AI assistant
 * @param request - Message request with content and context
 * @returns Response with AI assistant's reply
 */
export const sendMessage = async (
  request: SendMessageRequest
): Promise<SendMessageResponse> => {
  const { data } = await axios.post<SendMessageResponse>(
    `${CHAT_API_BASE_URL}/messages`,
    request
  )
  return data
}

/**
 * Send a message with streaming response
 * @param request - Message request
 * @param onChunk - Callback for each stream chunk
 * @returns Promise that resolves when stream completes
 */
export const sendMessageStream = async (
  request: SendMessageRequest,
  onChunk: (chunk: StreamChunk) => void
): Promise<void> => {
  const response = await fetch(`${CHAT_API_BASE_URL}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header if needed
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    },
    body: JSON.stringify({ ...request, stream: true }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            onChunk({ type: 'end' })
            return
          }
          try {
            const parsed: StreamChunk = JSON.parse(data)
            onChunk(parsed)
          } catch (e) {
            console.error('Error parsing stream chunk:', e)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Get all chat sessions for the current user
 * @returns List of chat sessions
 */
export const getChatSessions = async (): Promise<GetSessionsResponse> => {
  const { data } = await axios.get<GetSessionsResponse>(`${CHAT_API_BASE_URL}/sessions`)
  return data
}

/**
 * Get a specific chat session by ID
 * @param sessionId - The session ID
 * @returns Chat session with messages
 */
export const getChatSession = async (sessionId: string): Promise<GetSessionResponse> => {
  const { data } = await axios.get<GetSessionResponse>(
    `${CHAT_API_BASE_URL}/sessions/${sessionId}`
  )
  return data
}

/**
 * Create a new chat session
 * @param request - Session creation request
 * @returns New session data
 */
export const createChatSession = async (
  request: CreateSessionRequest = {}
): Promise<CreateSessionResponse> => {
  const { data } = await axios.post<CreateSessionResponse>(
    `${CHAT_API_BASE_URL}/sessions`,
    request
  )
  return data
}

/**
 * Delete a chat session
 * @param sessionId - The session ID to delete
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  await axios.delete(`${CHAT_API_BASE_URL}/sessions/${sessionId}`)
}

/**
 * Update chat session title
 * @param sessionId - The session ID
 * @param title - New title
 */
export const updateChatSessionTitle = async (
  sessionId: string,
  title: string
): Promise<void> => {
  await axios.patch(`${CHAT_API_BASE_URL}/sessions/${sessionId}`, { title })
}

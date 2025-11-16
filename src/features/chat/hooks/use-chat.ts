import { useState, useCallback, useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { sendMessageStream } from '../api/chat'
import type { ChatMessage, StreamChunk } from '../types/chat'

interface UseChatOptions {
  sessionId?: string
  initialMessages?: ChatMessage[]
  invoiceContext?: {
    jobId?: string
    invoiceNumber?: string
    carrier?: string
  }
  onError?: (error: Error) => void
}

export function useChat(options: UseChatOptions = {}) {
  const { sessionId, initialMessages = [], invoiceContext, onError } = options

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Add a message to the chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  // Update a message
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      )
    },
    []
  )

  // Send a message with streaming
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Create user message
      const userMessage: ChatMessage = {
        id: nanoid(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent',
        invoiceContext: invoiceContext
          ? {
              jobId: invoiceContext.jobId || '',
              invoiceNumber: invoiceContext.invoiceNumber,
              carrier: invoiceContext.carrier,
            }
          : undefined,
      }

      addMessage(userMessage)

      // Create assistant message placeholder
      const assistantMessageId = nanoid()
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        status: 'streaming',
      }

      addMessage(assistantMessage)
      setIsStreaming(true)
      setCurrentStreamingMessageId(assistantMessageId)

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      try {
        await sendMessageStream(
          {
            message: content,
            sessionId,
            invoiceContext,
            stream: true,
          },
          (chunk: StreamChunk) => {
            if (chunk.type === 'content' && chunk.content) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + chunk.content, status: 'streaming' as const }
                    : msg
                )
              )
            } else if (chunk.type === 'end') {
              updateMessage(assistantMessageId, {
                status: 'sent',
                timestamp: new Date().toISOString(),
              })
              setIsStreaming(false)
              setCurrentStreamingMessageId(null)
            } else if (chunk.type === 'error') {
              updateMessage(assistantMessageId, {
                status: 'error',
                error: chunk.error || 'An error occurred',
              })
              setIsStreaming(false)
              setCurrentStreamingMessageId(null)
              toast.error(chunk.error || 'Failed to get response')
              onError?.(new Error(chunk.error || 'Stream error'))
            }
          }
        )
      } catch (error) {
        console.error('Chat error:', error)
        updateMessage(assistantMessageId, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to send message',
        })
        setIsStreaming(false)
        setCurrentStreamingMessageId(null)
        toast.error('Failed to send message')
        onError?.(error instanceof Error ? error : new Error('Unknown error'))
      }
    },
    [sessionId, invoiceContext, addMessage, updateMessage, onError]
  )

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (currentStreamingMessageId) {
      updateMessage(currentStreamingMessageId, {
        status: 'sent',
      })
    }

    setIsStreaming(false)
    setCurrentStreamingMessageId(null)
  }, [currentStreamingMessageId, updateMessage])

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    messages,
    isStreaming,
    sendMessage,
    stopStreaming,
    clearMessages,
    addMessage,
    updateMessage,
  }
}

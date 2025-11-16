import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './components/chat-message'
import { ChatInput } from './components/chat-input'
import { ChatWelcome } from './components/chat-welcome'
import { useChat } from './hooks/use-chat'

interface ChatProps {
  sessionId?: string
  invoiceContext?: {
    jobId?: string
    invoiceNumber?: string
    carrier?: string
  }
}

export function Chat({ sessionId, invoiceContext }: ChatProps) {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChat({
    sessionId,
    invoiceContext,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const hasMessages = messages.length > 0

  return (
    <div className='flex h-full flex-col'>
      {/* Messages Area */}
      <div className='flex-1 overflow-hidden'>
        {hasMessages ? (
          <ScrollArea className='h-full' ref={scrollAreaRef}>
            <div className='mx-auto max-w-3xl'>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={
                    isStreaming && index === messages.length - 1 && message.role === 'assistant'
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        ) : (
          <ChatWelcome />
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder={
          invoiceContext?.invoiceNumber
            ? `Ask about invoice ${invoiceContext.invoiceNumber}...`
            : 'Ask about your invoices...'
        }
      />
    </div>
  )
}

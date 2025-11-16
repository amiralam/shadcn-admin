import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy, Bot, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { ChatMessage as ChatMessageType } from '../types/chat'
import 'highlight.js/styles/github-dark.css'

interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
}

export const ChatMessage = memo(({ message, isStreaming = false }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isError = message.status === 'error'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'group relative flex gap-4 px-4 py-6 transition-colors hover:bg-muted/30',
        isUser && 'bg-muted/50'
      )}
    >
      {/* Avatar */}
      <div className='flex-shrink-0'>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-full',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
          )}
        >
          {isUser ? <User className='size-4' /> : <Bot className='size-5' />}
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 space-y-2 overflow-hidden'>
        {/* Name */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold'>{isUser ? 'You' : 'Invoice AI'}</span>
          {isStreaming && (
            <div className='flex gap-1'>
              <div className='size-1 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.3s]' />
              <div className='size-1 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.15s]' />
              <div className='size-1 animate-bounce rounded-full bg-violet-500' />
            </div>
          )}
        </div>

        {/* Message Content */}
        {isError ? (
          <div className='flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3'>
            <AlertCircle className='mt-0.5 size-4 flex-shrink-0 text-destructive' />
            <div className='space-y-1'>
              <p className='text-sm font-medium text-destructive'>Error</p>
              <p className='text-sm text-destructive/80'>{message.error || message.content}</p>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              'prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4',
              'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5',
              'prose-code:before:content-none prose-code:after:content-none',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              isUser && 'text-foreground'
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Invoice Context Badge */}
        {message.invoiceContext && (
          <div className='flex gap-2 pt-2'>
            <div className='rounded-md bg-violet-500/10 px-2 py-1 text-xs text-violet-600 dark:text-violet-400'>
              {message.invoiceContext.invoiceNumber && (
                <span>Invoice: {message.invoiceContext.invoiceNumber}</span>
              )}
              {message.invoiceContext.carrier && (
                <span className='ml-2'>
                  Carrier: {message.invoiceContext.carrier.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isUser && !isError && (
        <div className='flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100'>
          <Button
            variant='ghost'
            size='icon'
            className='size-7'
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
          </Button>
        </div>
      )}

      {/* Timestamp */}
      <div className='absolute right-4 top-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
})

ChatMessage.displayName = 'ChatMessage'

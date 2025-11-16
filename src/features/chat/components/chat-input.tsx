import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Paperclip, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isStreaming?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = 'Ask about your invoice...',
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!input.trim() || disabled || isStreaming) return

    onSend(input.trim())
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  return (
    <div className='border-t bg-background p-4'>
      <div className='mx-auto max-w-3xl'>
        <div className='relative flex items-end gap-2'>
          {/* Attach Button (Future feature) */}
          <Button
            variant='ghost'
            size='icon'
            className='mb-2 flex-shrink-0'
            disabled={disabled || isStreaming}
            title='Attach file (coming soon)'
          >
            <Paperclip className='size-4' />
          </Button>

          {/* Input */}
          <div className='relative flex-1'>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isStreaming}
              className={cn(
                'min-h-[52px] max-h-[200px] resize-none pr-12',
                'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
              )}
              rows={1}
            />

            {/* Send/Stop Button */}
            <div className='absolute bottom-2 right-2'>
              {isStreaming ? (
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  onClick={onStop}
                  className='size-8 bg-destructive/10 text-destructive hover:bg-destructive/20'
                >
                  <StopCircle className='size-4' />
                </Button>
              ) : (
                <Button
                  type='button'
                  size='icon'
                  onClick={handleSend}
                  disabled={!input.trim() || disabled}
                  className={cn(
                    'size-8 transition-all',
                    input.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Send className='size-4' />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className='mt-2 text-center text-xs text-muted-foreground'>
          Press <kbd className='rounded bg-muted px-1.5 py-0.5'>Enter</kbd> to send,{' '}
          <kbd className='rounded bg-muted px-1.5 py-0.5'>Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  )
}

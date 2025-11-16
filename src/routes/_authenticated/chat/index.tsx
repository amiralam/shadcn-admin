import { createFileRoute } from '@tanstack/react-router'
import { Chat } from '@/features/chat'

export const Route = createFileRoute('/_authenticated/chat/')({
  component: ChatPage,
})

function ChatPage() {
  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col'>
      <Chat />
    </div>
  )
}

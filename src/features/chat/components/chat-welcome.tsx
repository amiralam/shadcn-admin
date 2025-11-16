import { Bot, FileText, TrendingUp, Zap, Search } from 'lucide-react'

export function ChatWelcome() {
  const suggestions = [
    {
      icon: FileText,
      title: 'Analyze Invoice',
      description: 'Get detailed breakdown of charges and fees',
    },
    {
      icon: TrendingUp,
      title: 'Compare Rates',
      description: 'Compare carrier rates and identify savings',
    },
    {
      icon: Search,
      title: 'Find Discrepancies',
      description: 'Identify billing errors and overcharges',
    },
    {
      icon: Zap,
      title: 'Generate Report',
      description: 'Create summary reports for management',
    },
  ]

  return (
    <div className='flex flex-1 flex-col items-center justify-center p-8'>
      <div className='mx-auto max-w-2xl space-y-8 text-center'>
        {/* Logo/Icon */}
        <div className='mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600'>
          <Bot className='size-10 text-white' />
        </div>

        {/* Title */}
        <div className='space-y-3'>
          <h1 className='text-4xl font-bold tracking-tight'>Invoice AI Assistant</h1>
          <p className='text-lg text-muted-foreground'>
            Your intelligent partner for carrier invoice analysis and insights
          </p>
        </div>

        {/* Suggestions */}
        <div className='grid gap-3 sm:grid-cols-2'>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className='group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-accent'
            >
              <div className='rounded-md bg-primary/10 p-2 transition-colors group-hover:bg-primary/20'>
                <suggestion.icon className='size-4 text-primary' />
              </div>
              <div className='flex-1 space-y-1'>
                <p className='font-medium'>{suggestion.title}</p>
                <p className='text-sm text-muted-foreground'>{suggestion.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <p className='text-xs text-muted-foreground'>
          This AI assistant can help you analyze invoices, identify cost savings, and answer questions
          about your carrier billing.
        </p>
      </div>
    </div>
  )
}

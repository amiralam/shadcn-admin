import * as React from 'react'
import { cn } from '@/lib/utils'

// Card
export interface CardProps extends React.ComponentProps<'div'> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card'
        className={cn(
          'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

// CardHeader
export interface CardHeaderProps extends React.ComponentProps<'div'> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-header'
        className={cn(
          '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
          className
        )}
        {...props}
      />
    )
  }
)
CardHeader.displayName = 'CardHeader'

// CardTitle
export interface CardTitleProps extends React.ComponentProps<'div'> {}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-title'
        className={cn('leading-none font-semibold', className)}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

// CardDescription
export interface CardDescriptionProps extends React.ComponentProps<'div'> {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-description'
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    )
  }
)
CardDescription.displayName = 'CardDescription'

// CardAction
export interface CardActionProps extends React.ComponentProps<'div'> {}

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-action'
        className={cn(
          'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
          className
        )}
        {...props}
      />
    )
  }
)
CardAction.displayName = 'CardAction'

// CardContent
export interface CardContentProps extends React.ComponentProps<'div'> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-content'
        className={cn('px-6', className)}
        {...props}
      />
    )
  }
)
CardContent.displayName = 'CardContent'

// CardFooter
export interface CardFooterProps extends React.ComponentProps<'div'> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='card-footer'
        className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

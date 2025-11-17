/**
 * Button Component (UI Export)
 *
 * This file re-exports the Button component from the atomic structure
 * for backward compatibility with existing imports.
 *
 * Existing imports will continue to work:
 *   import { Button } from '@/components/ui/button'
 *
 * New imports can use the atomic structure:
 *   import { Button } from '@/components/atoms/button'
 *
 * Both point to the same fully documented component.
 */

export { Button, buttonVariants, type ButtonProps } from '../atoms/button'

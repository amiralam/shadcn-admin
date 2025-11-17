/**
 * Design Tokens
 *
 * Centralized design system tokens for the shadcn-admin component library
 * These tokens provide a single source of truth for styling decisions
 * and enable AI agents to generate consistent, on-brand components
 */

export * from './colors'
export * from './spacing'
export * from './typography'
export * from './radius'

/**
 * Complete token reference for AI agents
 *
 * This object provides a high-level overview of all available tokens
 * and their purposes, making it easier for AI to discover and use them
 */
export const tokenReference = {
  colors: {
    description: 'Color palette including semantic colors, surfaces, and interactive states',
    categories: ['semantic', 'surface', 'interactive', 'borders', 'charts'],
    usage: 'Import from @/tokens and use colorTokens object',
  },
  spacing: {
    description: 'Spacing scale for margins, padding, and gaps',
    scale: '0-96 (0px - 384px) in incremental steps',
    usage: 'Import from @/tokens and use spacingTokens or semanticSpacing',
  },
  typography: {
    description: 'Type scale, font families, weights, and line heights',
    categories: ['headings', 'body', 'ui', 'code'],
    usage: 'Import from @/tokens and use fontSizes, fontWeights, typographyStyles',
  },
  radius: {
    description: 'Border radius values for component corners',
    scale: 'sm, md, lg, xl, full',
    usage: 'Import from @/tokens and use radiusTokens or semanticRadius',
  },
} as const

/**
 * Token usage examples for AI agents
 */
export const tokenUsageExamples = {
  colors: `
    import { colorTokens } from '@/tokens'

    // In Tailwind classes
    className="bg-primary text-primary-foreground"

    // In inline styles
    style={{ color: colorTokens.primary }}
  `,

  spacing: `
    import { spacingTokens, semanticSpacing } from '@/tokens'

    // In Tailwind classes
    className="p-4 gap-2"

    // Semantic spacing
    const padding = semanticSpacing.componentPaddingMd
  `,

  typography: `
    import { typographyStyles, fontSizes } from '@/tokens'

    // In Tailwind classes
    className="text-sm font-medium"

    // Semantic styles
    const headingStyle = typographyStyles.h2
  `,

  radius: `
    import { radiusTokens, semanticRadius } from '@/tokens'

    // In Tailwind classes
    className="rounded-md"

    // Semantic radius
    const buttonRadius = semanticRadius.button
  `,
} as const

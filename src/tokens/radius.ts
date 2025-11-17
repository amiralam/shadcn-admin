/**
 * Border Radius Design Tokens
 *
 * Standardized border radius values for consistent component styling
 * Based on --radius CSS variable from theme
 */

export const radiusTokens = {
  none: '0',
  sm: 'var(--radius-sm)',    // calc(var(--radius) - 4px) = ~6px
  md: 'var(--radius-md)',    // calc(var(--radius) - 2px) = ~8px
  lg: 'var(--radius-lg)',    // var(--radius) = 10px (0.625rem)
  xl: 'var(--radius-xl)',    // calc(var(--radius) + 4px) = ~14px
  full: '9999px',            // Fully rounded (pills, circles)
} as const

/**
 * Semantic radius values for common component types
 */
export const semanticRadius = {
  // Component types
  button: radiusTokens.md,
  input: radiusTokens.md,
  card: radiusTokens.lg,
  dialog: radiusTokens.lg,
  dropdown: radiusTokens.md,
  badge: radiusTokens.md,
  avatar: radiusTokens.full,
  tooltip: radiusTokens.sm,
  popover: radiusTokens.md,
  sheet: radiusTokens.lg,

  // Sizes
  small: radiusTokens.sm,
  medium: radiusTokens.md,
  large: radiusTokens.lg,
  extraLarge: radiusTokens.xl,
} as const

/**
 * Radius usage guidelines for AI agents
 */
export const radiusGuidelines = {
  general: 'Use consistent radius values to maintain design system cohesion',

  byComponent: {
    buttons: 'Use md for most buttons, sm for compact buttons',
    cards: 'Use lg for cards and major containers',
    inputs: 'Use md to match button radius for visual consistency',
    badges: 'Use md for rectangular badges, full for pill badges',
    avatars: 'Always use full for circular avatars',
    dialogs: 'Use lg for modals and dialogs',
  },

  recommendations: {
    consistency: 'Keep radius consistent within component groups (all buttons same, all inputs same)',
    context: 'Smaller radius (sm) for compact/dense UIs, larger (lg/xl) for spacious layouts',
    emphasis: 'Use full radius sparingly for special elements like pills or circular buttons',
  },
} as const

export type RadiusToken = keyof typeof radiusTokens
export type SemanticRadius = keyof typeof semanticRadius

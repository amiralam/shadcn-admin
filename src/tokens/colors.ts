/**
 * Color Design Tokens
 *
 * Centralized color system extracted from theme.css
 * Using CSS variables for runtime theming support
 */

export const colorTokens = {
  // Base colors
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',

  // Card colors
  card: 'var(--color-card)',
  cardForeground: 'var(--color-card-foreground)',

  // Popover colors
  popover: 'var(--color-popover)',
  popoverForeground: 'var(--color-popover-foreground)',

  // Primary colors
  primary: 'var(--color-primary)',
  primaryForeground: 'var(--color-primary-foreground)',

  // Secondary colors
  secondary: 'var(--color-secondary)',
  secondaryForeground: 'var(--color-secondary-foreground)',

  // Muted colors
  muted: 'var(--color-muted)',
  mutedForeground: 'var(--color-muted-foreground)',

  // Accent colors
  accent: 'var(--color-accent)',
  accentForeground: 'var(--color-accent-foreground)',

  // Destructive colors
  destructive: 'var(--color-destructive)',

  // Border and input colors
  border: 'var(--color-border)',
  input: 'var(--color-input)',
  ring: 'var(--color-ring)',

  // Chart colors
  chart1: 'var(--color-chart-1)',
  chart2: 'var(--color-chart-2)',
  chart3: 'var(--color-chart-3)',
  chart4: 'var(--color-chart-4)',
  chart5: 'var(--color-chart-5)',

  // Sidebar colors
  sidebar: 'var(--color-sidebar)',
  sidebarForeground: 'var(--color-sidebar-foreground)',
  sidebarPrimary: 'var(--color-sidebar-primary)',
  sidebarPrimaryForeground: 'var(--color-sidebar-primary-foreground)',
  sidebarAccent: 'var(--color-sidebar-accent)',
  sidebarAccentForeground: 'var(--color-sidebar-accent-foreground)',
  sidebarBorder: 'var(--color-sidebar-border)',
  sidebarRing: 'var(--color-sidebar-ring)',
} as const

/**
 * Color token categories for AI agent understanding
 */
export const colorCategories = {
  semantic: ['primary', 'secondary', 'accent', 'destructive', 'muted'],
  surface: ['background', 'card', 'popover', 'sidebar'],
  interactive: ['primary', 'secondary', 'accent', 'destructive'],
  borders: ['border', 'input', 'ring'],
  charts: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'],
} as const

/**
 * Color usage guidelines for AI agents
 */
export const colorGuidelines = {
  primary: 'Main brand color, use for primary actions and key interactive elements',
  secondary: 'Secondary actions, less prominent than primary',
  accent: 'Highlight information, hover states, selected items',
  destructive: 'Destructive actions (delete, remove), error states',
  muted: 'Subtle backgrounds, disabled states, secondary information',
  background: 'Main background color',
  foreground: 'Main text color',
  border: 'Default border color for dividers and containers',
  ring: 'Focus ring color for keyboard navigation',
} as const

export type ColorToken = keyof typeof colorTokens
export type ColorCategory = keyof typeof colorCategories

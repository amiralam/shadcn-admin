import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

/**
 * ComponentName is a [brief description].
 *
 * ## When to use
 * - Use case 1
 * - Use case 2
 *
 * ## Accessibility
 * - WCAG 2.1 AA compliant
 * - Keyboard navigable
 * - Screen reader optimized
 */
const meta = {
  title: 'Atoms/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed description of the component and its use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the component',
    },
    children: {
      control: 'text',
      description: 'Component content',
    },
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default component with standard configuration
 */
export const Default: Story = {
  args: {
    children: 'Default Component',
    variant: 'default',
    size: 'md',
  },
}

/**
 * Secondary variant for alternative styling
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary Component',
    variant: 'secondary',
  },
}

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    children: 'Small Component',
    size: 'sm',
  },
}

/**
 * Medium size variant (default)
 */
export const Medium: Story = {
  args: {
    children: 'Medium Component',
    size: 'md',
  },
}

/**
 * Large size variant
 */
export const Large: Story = {
  args: {
    children: 'Large Component',
    size: 'lg',
  },
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Component',
    disabled: true,
  },
}

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
    </div>
  ),
}

/**
 * All sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
}

/**
 * With icon example
 */
export const WithIcon: Story = {
  render: () => (
    <ComponentName>
      <svg
        className="mr-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      With Icon
    </ComponentName>
  ),
}

/**
 * Loading state example
 */
export const Loading: Story = {
  render: () => (
    <ComponentName disabled>
      <svg
        className="mr-2 h-4 w-4 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Loading...
    </ComponentName>
  ),
}

/**
 * Interactive playground for testing
 */
export const Playground: Story = {
  args: {
    children: 'Playground Component',
    variant: 'default',
    size: 'md',
    disabled: false,
  },
}

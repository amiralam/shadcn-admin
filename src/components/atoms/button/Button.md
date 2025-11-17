# COMPONENT: Button

VERSION: 1.0.0
CATEGORY: atom
COMPLEXITY: simple
WCAG: AA

---

## Overview

The Button component is a versatile, accessible button that supports multiple visual variants, sizes, and states. Built on top of Radix UI's Slot primitive, it provides a consistent, themeable button interface for user interactions.

### When to Use

- Triggering actions (save, submit, delete, etc.)
- Form submissions
- Opening modals or dialogs
- Navigation triggers
- Data operations
- Interactive controls

### When NOT to Use

- **Navigation between pages** - use Link component instead
- **Toggling boolean states** - use Switch component
- **Selecting from options** - use Checkbox or RadioGroup
- **Non-interactive text** - use regular text or labels

---

## Installation

```bash
# Using npm
npm install @radix-ui/react-slot class-variance-authority

# The button is already included in this component system
# Import from the atoms directory
```

---

## Quick Start

```tsx
import { Button } from "@/components/atoms/button"

function Example() {
  return (
    <Button variant="default" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  )
}
```

---

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style variant |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Size of the button |
| `asChild` | `boolean` | `false` | Render as child element (Radix Slot) |
| `disabled` | `boolean` | `false` | Disables the button |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type |
| `onClick` | `(event: MouseEvent) => void` | - | Click event handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | required | Button content |

---

## Variants

### Default

The primary action button with solid background color. Use for main actions.

```tsx
<Button variant="default">
  Save Changes
</Button>
```

**When to use:** Primary actions, form submissions, main CTAs

### Destructive

Red-themed button for destructive actions like delete or remove.

```tsx
<Button variant="destructive">
  Delete Account
</Button>
```

**When to use:** Destructive actions (delete, remove, cancel subscription)

### Outline

Button with border and transparent background. Use for secondary actions.

```tsx
<Button variant="outline">
  Cancel
</Button>
```

**When to use:** Secondary actions, cancel buttons, alternative options

### Secondary

Subtle button with muted background. Use for less prominent actions.

```tsx
<Button variant="secondary">
  Save Draft
</Button>
```

**When to use:** Tertiary actions, less important operations, alternative paths

### Ghost

Minimal button with no background, only hover state. Use for subtle interactions.

```tsx
<Button variant="ghost">
  Learn More
</Button>
```

**When to use:** Icon buttons, toolbar actions, subtle interactions, close buttons

### Link

Styled like a hyperlink with underline on hover. Use for navigation-like actions.

```tsx
<Button variant="link">
  View Details
</Button>
```

**When to use:** Actions that feel like navigation, inline text actions

---

## Sizes

### Small

Compact button for dense UIs and tables.

```tsx
<Button size="sm">
  Small Button
</Button>
```

**Height:** 32px (h-8)
**Padding:** 12px horizontal (px-3)

### Default (Medium)

Standard button size for most use cases.

```tsx
<Button size="default">
  Default Button
</Button>
```

**Height:** 36px (h-9)
**Padding:** 16px horizontal (px-4)

### Large

Prominent button for landing pages and important actions.

```tsx
<Button size="lg">
  Large Button
</Button>
```

**Height:** 40px (h-10)
**Padding:** 24px horizontal (px-6)

### Icon

Square button for icon-only actions. Always include `aria-label`.

```tsx
<Button size="icon" variant="ghost" aria-label="Delete">
  <TrashIcon className="h-4 w-4" />
</Button>
```

**Size:** 36x36px (size-9)
**Use case:** Icon-only buttons, toolbars

---

## State Variations

### Disabled

```tsx
<Button disabled>
  Disabled Button
</Button>
```

**Behavior:**
- Reduced opacity (50%)
- Pointer events disabled
- Cannot be clicked or focused
- Screen readers announce as disabled

### Loading

```tsx
import { Loader2 } from "lucide-react"

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

**Pattern:** Disable button and show loading spinner during async operations

### With Icons

```tsx
import { Plus } from "lucide-react"

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

**Best practice:** Use 16x16px icons (h-4 w-4) with 8px margin (mr-2)

---

## Composition Patterns

### Form Submit Button

Standard pattern for form submission with loading state.

```tsx
import { Button } from "@/components/atoms/button"

function FormExample() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await submitForm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

### Modal Action Buttons

Buttons in dialog or modal footers.

```tsx
<DialogFooter>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button onClick={onConfirm}>
    Confirm
  </Button>
</DialogFooter>
```

### Button Group

Multiple related buttons in a row.

```tsx
<div className="flex gap-2">
  <Button variant="outline">
    Cancel
  </Button>
  <Button variant="secondary">
    Save Draft
  </Button>
  <Button>
    Publish
  </Button>
</div>
```

### Icon Button with Tooltip

Icon-only button with tooltip for context.

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Delete item">
      <TrashIcon className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Delete</p>
  </TooltipContent>
</Tooltip>
```

### Async Action with Loading

```tsx
function AsyncButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await performAction()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? "Processing..." : "Process"}
    </Button>
  )
}
```

### As Child (Polymorphic)

Render button styles on other elements using `asChild`.

```tsx
import Link from "next/link"

<Button asChild>
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</Button>
```

**Use case:** Apply button styling to Link, anchor, or custom components

---

## Accessibility

### ARIA Attributes

The Button component automatically handles:

- **role="button"** - Implicitly provided by `<button>` element
- **aria-disabled** - Set when `disabled={true}`
- **aria-label** - Should be provided for icon-only buttons
- **aria-pressed** - Can be added for toggle buttons
- **aria-expanded** - Can be added for disclosure buttons

### Keyboard Navigation

- **Enter or Space** - Activates the button
- **Tab** - Moves focus to the button
- **Shift+Tab** - Moves focus away from the button

### Screen Reader Support

The component announces:
- Button text content
- Disabled state
- Loading state (via aria-label or aria-live regions)
- Icon-only buttons via aria-label

### Focus Management

- Visible focus ring for keyboard navigation (`focus-visible:ring`)
- No focus ring for mouse clicks (uses `focus-visible` not `focus`)
- Focus ring color uses semantic `--ring` token
- 3px ring for better visibility

---

## Design Tokens

This component uses the following design tokens:

### Colors

- `primary` - Default variant background
- `primary-foreground` - Default variant text
- `destructive` - Destructive variant color
- `secondary` - Secondary variant background
- `accent` - Outline variant hover
- `border` - Outline variant border
- `ring` - Focus ring color

### Spacing

- `2` (8px) - Gap between icon and text
- `3` (12px) - Small button padding
- `4` (16px) - Default button padding
- `6` (24px) - Large button padding

### Typography

- `sm` (14px) - Button text size
- `medium` weight - Button font weight

### Radius

- `md` (8px) - Default border radius for all sizes

---

## Best Practices

### ✅ Do

- **Use descriptive text** that clearly indicates what will happen
  ```tsx
  <Button>Save Changes</Button>
  ```

- **Provide loading states** for async operations
  ```tsx
  <Button disabled={isLoading}>
    {isLoading ? "Saving..." : "Save"}
  </Button>
  ```

- **Include aria-label** for icon-only buttons
  ```tsx
  <Button size="icon" aria-label="Delete item">
    <TrashIcon />
  </Button>
  ```

- **Use appropriate variants** for action severity
  ```tsx
  <Button variant="destructive">Delete</Button>
  ```

- **Group related buttons** with consistent spacing
  ```tsx
  <div className="flex gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </div>
  ```

### ❌ Don't

- **Don't use generic text**
  ```tsx
  {/* ❌ Bad */}
  <Button>Click here</Button>
  <Button>Submit</Button>

  {/* ✅ Good */}
  <Button>Create Account</Button>
  <Button type="submit">Save Changes</Button>
  ```

- **Don't use buttons for navigation**
  ```tsx
  {/* ❌ Bad */}
  <Button onClick={() => router.push('/dashboard')}>
    Dashboard
  </Button>

  {/* ✅ Good */}
  <Button asChild>
    <Link href="/dashboard">Dashboard</Link>
  </Button>
  ```

- **Don't forget to disable during async operations**
  ```tsx
  {/* ❌ Bad */}
  <Button onClick={asyncOperation}>Save</Button>

  {/* ✅ Good */}
  <Button onClick={asyncOperation} disabled={isLoading}>
    {isLoading ? "Saving..." : "Save"}
  </Button>
  ```

- **Don't nest interactive elements**
  ```tsx
  {/* ❌ Bad */}
  <Button>
    <a href="/link">Click me</a>
  </Button>

  {/* ✅ Good */}
  <Button asChild>
    <a href="/link">Click me</a>
  </Button>
  ```

---

## AI Agent Guidelines

### When to Use This Component

AI agents should use the Button component when:

1. **User needs to trigger an action** (save, submit, delete, etc.)
2. **Form submission is required** (use `type="submit"`)
3. **Opening a modal or dialog** (use default or secondary variant)
4. **Performing data operations** (CRUD actions)
5. **Interactive controls** that aren't navigation or state toggles

### When to Choose Alternatives

| Scenario | Use Instead | Reason |
|----------|-------------|--------|
| Navigating to another page | `Link` component | Semantic HTML, better SEO |
| Toggling on/off states | `Switch` component | Clear toggle UI pattern |
| Selecting from options | `Checkbox` or `RadioGroup` | Multiple/single selection |
| Non-interactive text | Regular text element | Not interactive |
| Dropdown menus | `DropdownMenu` | Better UX for multiple options |

### Common Mistakes to Avoid

#### 1. Using buttons for navigation

**❌ Bad:**
```tsx
<Button onClick={() => navigate('/dashboard')}>
  Go to Dashboard
</Button>
```

**✅ Good:**
```tsx
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

#### 2. Missing loading states

**❌ Bad:**
```tsx
<Button onClick={async () => await saveData()}>
  Save
</Button>
```

**✅ Good:**
```tsx
<Button onClick={handleSave} disabled={isLoading}>
  {isLoading ? "Saving..." : "Save"}
</Button>
```

#### 3. Icon-only without aria-label

**❌ Bad:**
```tsx
<Button size="icon">
  <TrashIcon className="h-4 w-4" />
</Button>
```

**✅ Good:**
```tsx
<Button size="icon" aria-label="Delete item">
  <TrashIcon className="h-4 w-4" />
</Button>
```

#### 4. Wrong variant for action severity

**❌ Bad:**
```tsx
<Button variant="default" onClick={deleteAccount}>
  Delete Account
</Button>
```

**✅ Good:**
```tsx
<Button variant="destructive" onClick={deleteAccount}>
  Delete Account
</Button>
```

### Composition Recommendations

**Frequently Paired With:**

- **Form components** (Input, Label, Checkbox) - for form actions
- **Dialog/Modal** - for modal action buttons
- **Card** - for card actions in footers
- **Tooltip** - for icon button context

**Typical Hierarchies:**

```
Form
└── FormFields...
└── Button (type="submit")

Dialog
└── DialogContent
    └── DialogHeader
    └── DialogBody
    └── DialogFooter
        └── Button (Cancel)
        └── Button (Confirm)

Card
└── CardHeader
└── CardContent
└── CardFooter
    └── Button Group
```

---

## Related Components

- **Link** - For navigation between pages
- **DropdownMenu** - For multiple action options
- **Dialog** - Often contains action buttons
- **Tooltip** - For adding context to icon buttons
- **Switch** - For toggle states
- **Checkbox** - For selecting options

---

## Technical Details

### Component Structure

```
button/
├── Button.tsx              # Main component implementation
├── Button.schema.json      # Component metadata for AI agents
├── Button.md               # This documentation
├── Button.test.tsx         # Unit tests (coming soon)
├── Button.stories.tsx      # Storybook stories (coming soon)
└── index.ts                # Exports
```

### Dependencies

**Internal:**
- `cn` utility - Class name merging

**External:**
- `@radix-ui/react-slot` - Polymorphic rendering
- `class-variance-authority` - Variant management

**Components:**
- None (atom-level component)

### Browser Support

- ✅ Chrome/Edge: Latest 2 versions
- ✅ Firefox: Latest 2 versions
- ✅ Safari: Latest 2 versions
- ✅ Mobile browsers: iOS Safari, Chrome Mobile

### Performance

- **Bundle size**: ~2KB gzipped (including dependencies)
- **Render time**: <1ms
- **Re-render optimization**: Memoization not needed (simple component)

---

## Examples

### Example 1: Simple Form

```tsx
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"

export function SimpleForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button type="submit">Sign In</Button>
    </form>
  )
}
```

### Example 2: Confirmation Dialog

```tsx
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"

export function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <h2>Confirm Deletion</h2>
        </DialogHeader>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Example 3: Async Data Fetch

```tsx
import { Button } from "@/components/atoms/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export function DataFetcher() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={fetchData} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Loading..." : "Fetch Data"}
      </Button>
      {error && <p className="text-destructive mt-2">{error}</p>}
      {data && <pre className="mt-4">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

---

## Changelog

### 1.0.0 (2024-11-17)

- ✨ Initial release with full AI-ready documentation
- ✨ 6 variants: default, destructive, outline, secondary, ghost, link
- ✨ 4 sizes: default, sm, lg, icon
- ✅ Full WCAG 2.1 AA accessibility support
- ✅ Keyboard navigation support
- ✅ Loading state patterns
- ✅ Icon integration support
- 📝 Comprehensive documentation for AI agents
- 📝 Usage guidelines and composition patterns

---

**Last Updated**: November 17, 2024
**Maintained By**: Engineering Team
**Status**: ✅ Stable - Production Ready

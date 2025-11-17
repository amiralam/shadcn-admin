# Contributing to AI-Ready Component System

Thank you for contributing to the AI-ready component system! This guide will help you create components that are optimized for both human developers and AI agents.

---

## Component Development Checklist

When creating or migrating a component, ensure you complete ALL of these items:

### 📁 File Structure

- [ ] Create component directory in correct category (atoms/molecules/organisms/templates/patterns)
- [ ] Create `ComponentName.tsx` - Main implementation
- [ ] Create `ComponentName.schema.json` - AI-readable metadata
- [ ] Create `ComponentName.md` - Comprehensive documentation
- [ ] Create `ComponentName.test.tsx` - Unit tests (when infrastructure ready)
- [ ] Create `ComponentName.stories.tsx` - Storybook stories (when ready)
- [ ] Create `index.ts` - Exports

### 💻 Implementation (`ComponentName.tsx`)

- [ ] Use TypeScript with strict typing
- [ ] Export Props interface
- [ ] Use `React.forwardRef` if component needs ref
- [ ] Apply `cn()` utility for className merging
- [ ] Use design tokens (no hard-coded values)
- [ ] Include `data-slot` attribute for debugging
- [ ] Support all standard HTML attributes
- [ ] Use class-variance-authority for variants
- [ ] Handle edge cases (undefined, null, empty)

### 📋 Schema (`ComponentName.schema.json`)

- [ ] Reference `component-schema.json` in `$schema`
- [ ] Include all props with types
- [ ] List all variants and their values
- [ ] Document dependencies (internal, external, components)
- [ ] Define accessibility properties
- [ ] Include usage complexity level
- [ ] Provide 3-5 code examples
- [ ] Add AI guidance section
- [ ] List design tokens used
- [ ] Add searchable tags

### 📖 Documentation (`ComponentName.md`)

- [ ] Overview section with when to use/not use
- [ ] Installation instructions
- [ ] Quick start example
- [ ] Complete Props API table
- [ ] All variants with examples
- [ ] All sizes with examples
- [ ] State variations (disabled, loading, etc.)
- [ ] Composition patterns (5+ examples)
- [ ] Accessibility section (ARIA, keyboard, screen reader)
- [ ] Design tokens section
- [ ] Best practices (Do's and Don'ts)
- [ ] AI agent guidelines section
- [ ] Related components
- [ ] Complete code examples
- [ ] Troubleshooting section
- [ ] Changelog

### 🧪 Testing (When Infrastructure Ready)

- [ ] Unit tests for all props
- [ ] Variant tests
- [ ] Size tests
- [ ] Disabled state tests
- [ ] Event handler tests
- [ ] Accessibility tests (ARIA, keyboard navigation)
- [ ] Edge case tests
- [ ] 80%+ code coverage

### 📚 Storybook (When Ready)

- [ ] Default story
- [ ] All variants as stories
- [ ] All sizes as stories
- [ ] All states as stories
- [ ] Composition examples
- [ ] Interactive playground

### ✅ Accessibility

- [ ] WCAG 2.1 AA compliance minimum
- [ ] Semantic HTML elements
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation support
- [ ] Screen reader tested
- [ ] Focus management
- [ ] Color contrast verified
- [ ] aria-label for icon-only variants

### 🎨 Design System

- [ ] Use color tokens from `@/tokens`
- [ ] Use spacing tokens from `@/tokens`
- [ ] Use typography tokens from `@/tokens`
- [ ] Use radius tokens from `@/tokens`
- [ ] No hard-coded colors
- [ ] No hard-coded spacing
- [ ] No hard-coded font sizes
- [ ] Follow naming conventions

### 📦 Registration

- [ ] Add to `src/registry/component-registry.ts`
- [ ] Add to `src/registry/component-registry.json`
- [ ] Update component count in docs

---

## Step-by-Step Guide

### 1. Choose Component Category

Determine where your component belongs:

- **Atom** - Single-purpose, indivisible (Button, Input, Label)
- **Molecule** - Simple combination of atoms (FormField, SearchBar)
- **Organism** - Complex UI section (Header, DataTable)
- **Template** - Page-level layout (DashboardLayout)
- **Pattern** - Common implementation (AuthenticationFlow)

### 2. Create Directory

```bash
# Example for atom
mkdir -p src/components/atoms/my-component

# Example for molecule
mkdir -p src/components/molecules/my-component
```

### 3. Copy Templates

```bash
# Copy all templates
cp templates/component/Component.schema.template.json \
   src/components/atoms/my-component/MyComponent.schema.json

cp templates/component/Component.md.template \
   src/components/atoms/my-component/MyComponent.md

cp templates/component/Component.test.template.tsx \
   src/components/atoms/my-component/MyComponent.test.tsx

cp templates/component/Component.stories.template.tsx \
   src/components/atoms/my-component/MyComponent.stories.tsx
```

### 4. Implement Component

```tsx
// src/components/atoms/my-component/MyComponent.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const myComponentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface MyComponentProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof myComponentVariants> {
  // Additional props
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="my-component"
        className={cn(myComponentVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MyComponent.displayName = 'MyComponent'

export { MyComponent, myComponentVariants }
```

### 5. Create Schema

Update `MyComponent.schema.json` with:
- Component name
- Category
- Props definitions
- Variants
- Dependencies
- AI guidance

### 6. Write Documentation

Update `MyComponent.md` with:
- Overview
- Usage examples
- Props API
- Accessibility notes
- Best practices
- AI guidelines

### 7. Register Component

Add to `src/registry/component-registry.ts`:

```typescript
export const componentRegistry: ComponentMetadata[] = [
  // ... existing components
  {
    name: 'MyComponent',
    category: 'atom',
    path: 'src/components/atoms/my-component/MyComponent.tsx',
    schema: 'src/components/atoms/my-component/MyComponent.schema.json',
    documentation: 'src/components/atoms/my-component/MyComponent.md',
    internalDependencies: ['cn'],
    externalDependencies: ['class-variance-authority'],
    componentDependencies: [],
    tags: ['display', 'content'],
    complexity: 'simple',
    lastUpdated: '2024-11-17',
    version: '1.0.0',
    description: 'Brief description',
    wcagLevel: 'AA',
    hasTesting: false,
    hasStorybook: false,
  },
]
```

Also add to `src/registry/component-registry.json`.

### 8. Create Index File

```typescript
// src/components/atoms/my-component/index.ts
export { MyComponent, myComponentVariants } from './MyComponent'
export type { MyComponentProps } from './MyComponent'
```

---

## Design Token Usage

### ✅ Do Use Tokens

```tsx
// Good - using color tokens
className="bg-primary text-primary-foreground"

// Good - using spacing tokens
className="p-4 gap-2"

// Good - using typography tokens
className="text-sm font-medium"

// Good - using radius tokens
className="rounded-md"
```

### ❌ Don't Hard-Code

```tsx
// Bad - hard-coded colors
className="bg-blue-500 text-white"

// Bad - hard-coded spacing
className="p-[16px] gap-[8px]"

// Bad - hard-coded sizes
className="text-[14px] font-[500]"

// Bad - hard-coded radius
className="rounded-[8px]"
```

---

## Accessibility Requirements

Every component MUST:

1. **Use semantic HTML** - `<button>` for buttons, `<a>` for links, etc.
2. **Include ARIA attributes** - `aria-label`, `aria-disabled`, etc.
3. **Support keyboard navigation** - Tab, Enter, Space, Arrow keys
4. **Have focus indicators** - Visible focus ring using `focus-visible`
5. **Work with screen readers** - Test with VoiceOver/NVDA
6. **Meet color contrast** - WCAG AA minimum (4.5:1 for text)
7. **Document accessibility** - In component docs

---

## AI Guidance Section

Every component schema should include detailed AI guidance:

```json
{
  "aiGuidance": {
    "whenToUse": "Specific scenarios where AI should use this component",
    "whenNotToUse": "When to avoid and what to use instead",
    "alternatives": ["ComponentA", "ComponentB"],
    "commonMistakes": [
      "Mistake 1 description",
      "Mistake 2 description"
    ],
    "compositionPatterns": [
      {
        "pattern": "Pattern Name",
        "description": "What this pattern does",
        "example": "Code example"
      }
    ]
  }
}
```

---

## Code Style

### TypeScript

- Use strict mode
- Export all interfaces
- No `any` types
- Explicit return types for functions
- Use const assertions where appropriate

### Naming Conventions

- Components: `PascalCase` (MyComponent)
- Files: `PascalCase.tsx` (MyComponent.tsx)
- Props: `PascalCase` (MyComponentProps)
- Variants: `camelCase` (buttonVariants)
- Functions: `camelCase` (handleClick)

### File Organization

```tsx
// 1. Imports
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 2. Variant definitions
const componentVariants = cva(...)

// 3. Props interface
export interface ComponentProps {}

// 4. Component implementation
const Component = React.forwardRef(...)

// 5. Display name
Component.displayName = 'Component'

// 6. Exports
export { Component, componentVariants }
```

---

## Testing Guidelines (When Infrastructure Ready)

### Unit Tests

```tsx
describe('MyComponent', () => {
  it('renders successfully', () => {
    render(<MyComponent>Content</MyComponent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies variants correctly', () => {
    // Test all variants
  })

  it('handles events', () => {
    // Test event handlers
  })
})
```

### Accessibility Tests

```tsx
describe('Accessibility', () => {
  it('has correct ARIA attributes', () => {
    // Test ARIA
  })

  it('supports keyboard navigation', () => {
    // Test keyboard
  })

  it('announces to screen readers', () => {
    // Test screen reader
  })
})
```

---

## Documentation Style

### Writing for AI Agents

- Be explicit and specific
- Provide concrete examples
- List common mistakes
- Show good vs bad patterns
- Include composition examples
- Use consistent formatting

### Example Structure

```markdown
# COMPONENT: ComponentName

VERSION: 1.0.0
CATEGORY: atom
COMPLEXITY: simple
WCAG: AA

## Overview
Clear description...

## When to Use
- Specific use case 1
- Specific use case 2

## When NOT to Use
- Anti-pattern 1 - use X instead
- Anti-pattern 2 - use Y instead

## Props API
Complete table...

## Examples
Multiple concrete examples...

## AI Agent Guidelines
Detailed AI-specific guidance...
```

---

## Common Mistakes to Avoid

### ❌ Don't

1. **Hard-code values** - Use design tokens
2. **Skip accessibility** - WCAG AA minimum required
3. **Incomplete docs** - All sections required
4. **Missing AI guidance** - Critical for AI agents
5. **No examples** - Show don't tell
6. **Unclear props** - Document every prop
7. **Forget registration** - Add to registry
8. **Skip tests** - 80% coverage target

### ✅ Do

1. **Use design tokens** - Colors, spacing, typography
2. **Document thoroughly** - All required sections
3. **Provide examples** - 5+ concrete examples
4. **Test accessibility** - Keyboard, screen reader
5. **Write AI guidance** - When to use, mistakes
6. **Follow patterns** - Consistent with other components
7. **Register properly** - Both TS and JSON
8. **Test thoroughly** - Unit, accessibility, visual

---

## Questions?

For questions or clarifications:

1. Review existing components (Button is the reference)
2. Check templates in `templates/component/`
3. Read `AI_READY_COMPONENTS.md`
4. Review component audit in `COMPONENT_AUDIT.md`

---

## Component Review Checklist

Before submitting a component:

- [ ] All required files created
- [ ] Component implements all variants
- [ ] Schema is complete and valid
- [ ] Documentation is comprehensive
- [ ] Accessibility tested
- [ ] Design tokens used throughout
- [ ] Registered in both TS and JSON
- [ ] Examples are clear and complete
- [ ] AI guidance is detailed
- [ ] Code follows style guide
- [ ] Tests written (when infrastructure ready)

---

**Remember:** Every component should be production-ready, accessible, well-documented, and optimized for AI agent usage!

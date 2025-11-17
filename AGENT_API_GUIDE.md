# Agent API Usage Guide

**For AI Agents** | Runtime Component Discovery & Validation

---

## Quick Start

```typescript
import { agentAPI } from '@/registry/agent-api'

// 1. Discover all available components
const all Components = agentAPI.getAllComponents()
console.log(`Found ${allComponents.length} components`)

// 2. Find a specific component
const button = agentAPI.getComponent('Button')
console.log(button.path)          // src/components/ui/button.tsx
console.log(button.schema)        // src/components/atoms/button/Button.schema.json
console.log(button.description)   // A versatile button component...

// 3. Get component health
const health = agentAPI.getComponentHealth('Button')
console.log(health.hasSchema)      // true
console.log(health.hasDocumentation) // true
console.log(health.issues)         // []

// 4. Generate code
const importStmt = agentAPI.generateImport('Button')
// Returns: import { Button } from '@/components/ui/button'

const usage = agentAPI.generateUsage('Button', { variant: 'destructive' })
// Returns: <Button variant="destructive" />
```

---

## Component Discovery

### 1. Get All Components

```typescript
const components = agentAPI.getAllComponents()
// Returns: Array<ComponentMetadata> - All 60 components
```

### 2. Filter by Category

```typescript
// Get atoms (basic building blocks)
const atoms = agentAPI.getAtoms()
// Returns: 16 components (Button, Input, Label, Badge, etc.)

// Get molecules (simple combinations)
const molecules = agentAPI.getMolecules()
// Returns: 21 components (Card, Tooltip, Dialog, etc.)

// Get organisms (complex sections)
const organisms = agentAPI.getOrganisms()
// Returns: 23 components (DataTable, Sidebar, Header, etc.)
```

### 3. Filter by Tags

```typescript
// Get all form components
const formComponents = agentAPI.getFormComponents()
// Returns: Button, Input, Label, Checkbox, Select, etc.

// Get all interactive components
const interactive = agentAPI.getInteractiveComponents()
// Returns: Button, Input, Checkbox, Switch, Select, etc.

// Get all layout components
const layout = agentAPI.getLayoutComponents()
// Returns: Sidebar, Header, AppSidebar, NavGroup, etc.

// Get by custom tag
const overlays = agentAPI.getByTag('overlay')
// Returns: Dialog, Popover, Tooltip, Sheet, DropdownMenu, etc.
```

### 4. Advanced Filtering

```typescript
// Discover with multiple filters
const components = await agentAPI.discoverComponents({
  category: 'atom',
  tags: ['form', 'interactive'],
  complexity: 'simple',
  hasSchema: true,
  hasDocumentation: true
})

// Example result: Button (has schema + docs + is simple form atom)
```

### 5. Search by Keyword

```typescript
// Search across name, description, and tags
const results = await agentAPI.searchComponents('button')
// Returns: Button, ButtonGroup (if exists), etc.

const dialogResults = await agentAPI.searchComponents('dialog')
// Returns: Dialog, AlertDialog, ConfirmDialog, SignOutDialog
```

---

## Component Information

### Get Component Metadata

```typescript
const button = agentAPI.getComponent('Button')

// Component details
button.name           // "Button"
button.category       // "atom"
button.path           // "src/components/ui/button.tsx"
button.description    // "A versatile button component..."

// Documentation paths
button.schema         // "src/components/atoms/button/Button.schema.json"
button.documentation  // "src/components/atoms/button/Button.md"

// Dependencies
button.internalDependencies  // ["cn"]
button.externalDependencies  // ["@radix-ui/react-slot", "class-variance-authority"]
button.componentDependencies // []

// Metadata
button.tags           // ["atom", "interactive", "form"]
button.complexity     // "simple"
button.wcagLevel      // "AA"
button.version        // "1.0.0"
button.lastUpdated    // "2024-11-17"

// Status
button.hasTesting     // false
button.hasStorybook   // false
button.migrationStatus // "documented"
```

### Load Component Schema

```typescript
// Load full schema with props, variants, AI guidance
const schema = await agentAPI.loadSchema('Button')

// Schema structure:
schema.props          // Prop definitions with types, defaults, descriptions
schema.accessibility  // WCAG info, ARIA support, keyboard navigation
schema.usage          // Complexity, use cases, best practices
schema.examples       // Code examples
schema.aiGuidance     // When to use, alternatives, common mistakes
schema.designTokens   // Colors, spacing, typography used
```

### Load Component Documentation

```typescript
// Load markdown documentation
const docs = await agentAPI.loadDocumentation('Button')
// Returns: Path to documentation or content
```

---

## Component Health & Status

### Check Component Health

```typescript
const health = agentAPI.getComponentHealth('Button')

health.name              // "Button"
health.status            // "healthy" | "warning" | "error"
health.hasSchema         // true
health.hasDocumentation  // true
health.hasTests          // false
health.hasStorybook      // false
health.importCount       // 46 (if analyzed)
health.coverage          // 0 (no tests yet)
health.migrationStatus   // "documented"
health.issues            // ["No unit tests", "No Storybook stories"]
```

### Get Registry Statistics

```typescript
const stats = agentAPI.getStats()

stats.total              // 60
stats.byCategory         // { atom: 16, molecule: 21, organism: 23, ... }
stats.byComplexity       // { simple: 40, moderate: 15, complex: 5 }
stats.documented         // 1
stats.withTests          // 0
stats.withStorybook      // 0
stats.wcagCompliance     // { AA: 60, AAA: 0 }
```

---

## Code Generation

### Generate Import Statement

```typescript
// Generate proper import for component
const importStmt = agentAPI.generateImport('Button')
// Returns: "import { Button } from '@/components/ui/button'"

// Works for all components
const inputImport = agentAPI.generateImport('Input')
// Returns: "import { Input } from '@/components/ui/input'"
```

### Generate Usage Example

```typescript
// Generate JSX with props
const usage = agentAPI.generateUsage('Button', {
  variant: 'destructive',
  size: 'lg'
})
// Returns: "<Button variant="destructive" size="lg" />"

// With boolean props
const disabledButton = agentAPI.generateUsage('Button', {
  disabled: true
})
// Returns: "<Button disabled />"

// With object props
const buttonWithHandler = agentAPI.generateUsage('Button', {
  onClick: '() => handleClick()'
})
// Returns: '<Button onClick={() => handleClick()} />'
```

### Suggest Alternatives

```typescript
// Get alternative components with similar functionality
const alternatives = agentAPI.suggestAlternatives('Button')
// Returns: ["Link", "IconButton", "DropdownMenu"] (components with overlapping tags)

const dialogAlts = agentAPI.suggestAlternatives('Dialog')
// Returns: ["Sheet", "Popover", "AlertDialog", "ConfirmDialog"]
```

---

## Validation

### Validate Props

```typescript
import { validatePropsAgainstSchema } from '@/registry/validators'

// Validate props against schema
const schema = await agentAPI.loadSchema('Button')
const result = validatePropsAgainstSchema(schema, {
  variant: 'super-destructive',  // ❌ Invalid
  size: 'xl'                      // ❌ Invalid
})

result.valid    // false
result.errors   // [
                //   { prop: 'variant', value: 'super-destructive',
                //     error: 'Invalid value', expected: ['default', 'destructive', ...] },
                //   { prop: 'size', value: 'xl',
                //     error: 'Invalid value', expected: ['default', 'sm', 'lg', 'icon'] }
                // ]
```

### Validate Import Path

```typescript
// Validate that import path is correct
const result = agentAPI.validateImportPath(
  'Button',
  '@/components/ui/button'
)

result.valid    // true
result.errors   // []
```

### Validate Design Tokens

```typescript
import { validateDesignTokens } from '@/registry/validators'

// Check for hard-coded values (anti-pattern)
const result = validateDesignTokens('bg-blue-500 text-red-600')

result.valid            // false
result.hardCodedValues  // ['bg-blue-500', 'text-red-600']
result.warnings         // [
                        //   'Hard-coded color found: "bg-blue-500". Use semantic tokens instead.',
                        //   'Hard-coded color found: "text-red-600". Use semantic tokens instead.'
                        // ]

// Validate correct usage
const goodResult = validateDesignTokens('bg-primary text-primary-foreground')
goodResult.valid        // true
```

### Validate JSX Usage

```typescript
import { validateJSXUsage } from '@/registry/validators'

// Validate component usage in JSX
const result = validateJSXUsage(
  '<Button variant="default">Click me</Button>',
  'Button'
)

result.valid    // true
result.errors   // []

// Detect errors
const badResult = validateJSXUsage(
  '<Button>Click me',  // Missing closing tag
  'Button'
)

badResult.valid   // false
badResult.errors  // ['JSX must be properly closed']
```

---

## Practical Examples

### Example 1: Build a Form

```typescript
// 1. Discover form components
const formComponents = agentAPI.getFormComponents()
// Returns: Button, Input, Label, Checkbox, Select, etc.

// 2. Check which have documentation
const documented = formComponents.filter(c =>
  c.schema && c.schema !== 'pending'
)
// Returns: Button (only one fully documented)

// 3. Generate form code
const buttonImport = agentAPI.generateImport('Button')
const inputImport = agentAPI.generateImport('Input')
const labelImport = agentAPI.generateImport('Label')

const formCode = `
${buttonImport}
${inputImport}
${labelImport}

function MyForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      ${agentAPI.generateUsage('Button', { type: 'submit' })}
    </form>
  )
}
`
```

### Example 2: Find the Right Component

```typescript
// User asks: "I need a way to show a confirmation message"

// 1. Search for relevant components
const dialogResults = await agentAPI.searchComponents('dialog')
// Returns: Dialog, AlertDialog, ConfirmDialog, SignOutDialog

const confirmResults = await agentAPI.searchComponents('confirm')
// Returns: ConfirmDialog

// 2. Get component details
const confirmDialog = agentAPI.getComponent('ConfirmDialog')

// 3. Check health/readiness
const health = agentAPI.getComponentHealth('ConfirmDialog')
if (health.hasSchema && health.hasDocumentation) {
  // Fully documented - safe to use
  const schema = await agentAPI.loadSchema('ConfirmDialog')
  // Read schema and generate code
} else {
  // Not documented yet - suggest alternative
  const alternatives = agentAPI.suggestAlternatives('ConfirmDialog')
  // Returns: Dialog, AlertDialog, etc.
}
```

### Example 3: Validate Generated Code

```typescript
// After generating component usage, validate it

// 1. Generate code
const code = `
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <Button variant="destructive" size="xl" className="bg-blue-500">
      Delete
    </Button>
  )
}
`

// 2. Validate import
const importValid = agentAPI.validateImportPath('Button', '@/components/ui/button')
// ✅ valid: true

// 3. Load schema and validate props
const schema = await agentAPI.loadSchema('Button')
const propsValid = validatePropsAgainstSchema(schema, {
  variant: 'destructive',  // ✅ Valid
  size: 'xl'               // ❌ Invalid ('xl' not in schema)
})
// Issues found: size="xl" should be one of: default, sm, lg, icon

// 4. Validate design tokens
const tokensValid = validateDesignTokens('bg-blue-500')
// ❌ Hard-coded color found - should use bg-destructive

// 5. Fix the issues
const fixedCode = `
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <Button variant="destructive" size="lg" className="additional-class">
      Delete
    </Button>
  )
}
`
```

---

## Complete Workflow Example

```typescript
/**
 * AI Agent Workflow: Build a Login Form
 */

async function buildLoginForm() {
  // Step 1: Discover needed components
  const formComponents = agentAPI.getFormComponents()

  // Step 2: Check which are documented
  const button = agentAPI.getComponent('Button')
  const input = agentAPI.getComponent('Input')
  const label = agentAPI.getComponent('Label')

  const buttonHealth = agentAPI.getComponentHealth('Button')

  // Step 3: Generate imports
  const imports = [
    agentAPI.generateImport('Button'),
    agentAPI.generateImport('Input'),
    agentAPI.generateImport('Label'),
  ]

  // Step 4: Load schemas for documented components
  let buttonSchema = null
  if (buttonHealth.hasSchema) {
    buttonSchema = await agentAPI.loadSchema('Button')
  }

  // Step 5: Generate component usage
  const submitButton = agentAPI.generateUsage('Button', {
    type: 'submit',
    className: 'w-full'
  })

  // Step 6: Validate generated code
  if (buttonSchema) {
    const validation = validatePropsAgainstSchema(buttonSchema, {
      type: 'submit',
      className: 'w-full'
    })

    if (!validation.valid) {
      console.log('Validation errors:', validation.errors)
      // Fix errors before proceeding
    }
  }

  // Step 7: Generate complete code
  const code = `
${imports.join('\n')}

function LoginForm() {
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

      ${submitButton}
    </form>
  )
}
  `.trim()

  return code
}
```

---

## Error Handling

### Component Not Found

```typescript
const component = agentAPI.getComponent('NonExistent')
// Returns: undefined

// Check before using
if (!component) {
  console.error('Component not found')
  // Search for alternatives
  const suggestions = await agentAPI.searchComponents('NonExistent')
}
```

### Schema Not Available

```typescript
const schema = await agentAPI.loadSchema('Input')
// Returns: null (not yet migrated)

// Check before using
if (!schema) {
  console.warn('Component not fully documented yet')
  // Use basic metadata from registry
  const component = agentAPI.getComponent('Input')
  console.log('Available info:', component.description)
}
```

### Validation Failures

```typescript
const result = validatePropsAgainstSchema(schema, props)

if (!result.valid) {
  // Handle errors
  result.errors.forEach(error => {
    console.error(`Error in prop "${error.prop}":`, error.error)
    if (error.expected) {
      console.log('Expected values:', error.expected)
    }
  })

  // Handle warnings
  result.warnings.forEach(warning => {
    console.warn(`Warning in prop "${warning.prop}":`, warning.error)
  })
}
```

---

## Best Practices for AI Agents

### 1. Always Check Health Before Using

```typescript
const health = agentAPI.getComponentHealth('ComponentName')

if (health.hasSchema && health.hasDocumentation) {
  // Fully documented - safe to use with full validation
  const schema = await agentAPI.loadSchema('ComponentName')
  // Generate code with validation
} else {
  // Not fully documented - use with basic metadata only
  const component = agentAPI.getComponent('ComponentName')
  // Generate code from description and path only
}
```

### 2. Use Search + Filter for Discovery

```typescript
// Don't hardcode component names
// Instead, search based on user intent

// User: "I need a button"
const results = await agentAPI.searchComponents('button')
const button = results.find(c => c.category === 'atom')  // Get the atomic button

// User: "I need a modal"
const modals = await agentAPI.searchComponents('dialog')
const suitable = modals.filter(c => c.hasSchema)  // Only documented ones
```

### 3. Validate Before Returning Code

```typescript
async function generateComponentUsage(componentName: string, props: Record<string, any>) {
  // 1. Get component
  const component = agentAPI.getComponent(componentName)
  if (!component) throw new Error('Component not found')

  // 2. Load schema if available
  const schema = await agentAPI.loadSchema(componentName)

  // 3. Validate props
  if (schema) {
    const validation = validatePropsAgainstSchema(schema, props)
    if (!validation.valid) {
      // Return validation errors to user
      return { success: false, errors: validation.errors }
    }
  }

  // 4. Generate code
  const code = agentAPI.generateUsage(componentName, props)

  return { success: true, code }
}
```

### 4. Handle Partial Documentation

```typescript
const component = agentAPI.getComponent('SomeComponent')

// Component exists but might not be fully documented
const hasFullDocs = component.schema && component.schema !== 'pending'

if (hasFullDocs) {
  // Use full schema-based generation
  const schema = await agentAPI.loadSchema(component.name)
  // Generate with validation
} else {
  // Use basic generation from metadata
  console.warn(`${component.name} not fully documented. Using basic metadata.`)
  // Generate simple usage based on description and tags
}
```

---

## Registry Statistics

Current state (as of last scan):

- **Total Components:** 60
- **Atoms:** 16 (basic building blocks)
- **Molecules:** 21 (simple combinations)
- **Organisms:** 23 (complex sections)
- **Documented:** 1 (Button - fully migrated)
- **Pending:** 59 (available but not fully documented)

All components are discoverable and usable, but only documented components have:
- Full JSON schemas
- Comprehensive markdown documentation
- AI guidance sections
- Prop validation

---

## Common Queries

### "Show me all form components"
```typescript
const formComponents = agentAPI.getFormComponents()
```

### "What components can I use for navigation?"
```typescript
const navComponents = agentAPI.getByTag('navigation')
```

### "Give me simple components only"
```typescript
const simple = await agentAPI.discoverComponents({ complexity: 'simple' })
```

### "Which components are fully documented?"
```typescript
const documented = await agentAPI.discoverComponents({ hasSchema: true, hasDocumentation: true })
```

### "What's similar to Button?"
```typescript
const alternatives = agentAPI.suggestAlternatives('Button')
```

---

## Next Steps

1. **More components will be documented** - The registry automatically updates as components are migrated
2. **Tests will be added** - `hasTesting` will become true for tested components
3. **Storybook will be added** - `hasStorybook` will indicate interactive examples
4. **Import counts will be tracked** - Real usage data will be available

Stay updated by checking:
```typescript
const stats = agentAPI.getStats()
console.log(`${stats.documented} of ${stats.total} components documented`)
```

---

**The Agent API makes component discovery and validation runtime-accessible for AI agents!** 🚀

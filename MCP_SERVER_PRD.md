# Product Requirements Document: MCP Server for AI-Ready Component System

## Document Information

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Author** | AI Engineering Team |
| **Created** | 2025-11-18 |
| **Last Updated** | 2025-11-18 |

---

## 1. Executive Summary

### Overview

This PRD outlines the development of a Model Context Protocol (MCP) server that exposes the shadcn-admin AI-ready component system to AI agents. The MCP server will provide a standardized interface for AI coding assistants like Claude Desktop to discover, understand, validate, and generate code using the 60-component library.

### Business Value

- **Accelerated Development**: Enable AI agents to generate production-ready React/TypeScript code that adheres to design system standards
- **Quality Assurance**: Provide real-time validation of component usage, props, and accessibility compliance
- **Discoverability**: Allow AI agents to explore and understand component capabilities through a structured API
- **Consistency**: Ensure all AI-generated code follows established patterns, design tokens, and best practices

### Scope

The MCP server will wrap the existing `AgentAPI` class and validators, exposing their functionality through MCP tools, resources, and prompts. It will run as a local Node.js process and communicate with MCP clients via stdio transport.

---

## 2. Goals & Success Metrics

### Primary Goals

1. **Enable AI-powered component discovery** - AI agents can find the right component for any use case
2. **Provide schema-driven code generation** - Generate correct JSX with proper props and imports
3. **Ensure code quality** - Validate props, accessibility, and design token usage
4. **Support incremental adoption** - Each phase delivers testable, standalone value

### Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Tool Response Time | < 100ms for discovery, < 200ms for validation | Performance benchmarks |
| Schema Coverage | 100% of documented components exposed | Automated testing |
| Validation Accuracy | 95%+ correct prop validation | Test suite coverage |
| Client Compatibility | Works with Claude Desktop, Continue, Cline | Manual testing |
| Documentation Coverage | All tools documented with examples | PRD review |

### Non-Goals

- Real-time hot module reloading of components
- Visual component preview generation
- Integration with specific IDEs (beyond MCP support)
- Component source code modification

---

## 3. Phased Implementation Plan

### Phase 1: Core Discovery & Metadata (MVP)

**Duration**: 3-4 days
**Objective**: Enable AI agents to discover and explore the component library

#### Deliverables

1. MCP server initialization and stdio transport
2. Component discovery and search tools
3. Registry statistics tool
4. Basic project structure with TypeScript

#### Tools Included

- `discover_components` - Filter components by category, tags, complexity
- `search_components` - Keyword search across components
- `get_component` - Get detailed metadata for a specific component
- `get_registry_stats` - Get overall registry statistics
- `list_atoms` / `list_molecules` / `list_organisms` - Category shortcuts

#### Acceptance Criteria

- [ ] MCP server starts and connects to Claude Desktop
- [ ] All discovery tools return correct component metadata
- [ ] Search returns relevant results for common queries ("button", "form", "navigation")
- [ ] Statistics accurately reflect 60 components with 9 documented

#### Testing Approach

```bash
# Start server and test with Claude Desktop
npx @anthropic-ai/mcp-inspector npx tsx src/mcp/index.ts

# Test queries in Claude Desktop:
# "What button components are available?"
# "Find all form-related atoms"
# "Show me registry statistics"
```

---

### Phase 2: Schema Loading & Code Generation

**Duration**: 3-4 days
**Objective**: Enable AI agents to generate correct component code

#### Deliverables

1. Schema loading for documented components
2. Import statement generation
3. Usage example generation
4. Documentation loading

#### Tools Included

- `load_schema` - Load full JSON schema for a component
- `load_documentation` - Load component documentation
- `generate_import` - Generate correct import statement
- `generate_usage` - Generate JSX usage with props
- `get_component_examples` - Get code examples from schema

#### Acceptance Criteria

- [ ] All 9 documented component schemas load correctly
- [ ] Generated imports use correct `@/` path aliases
- [ ] Generated JSX includes proper prop formatting
- [ ] Documentation returns actionable guidance

#### Testing Approach

```bash
# Test in Claude Desktop:
# "Load the Button schema and show me all available props"
# "Generate an import for the Select component"
# "Show me how to use the Checkbox with custom props"
```

---

### Phase 3: Validation & Health Checking

**Duration**: 3-4 days
**Objective**: Enable AI agents to validate their generated code

#### Deliverables

1. Props validation against schemas
2. Import path validation
3. Component health checking
4. Alternative component suggestions

#### Tools Included

- `validate_props` - Validate props object against component schema
- `validate_import_path` - Check if import path is correct
- `get_component_health` - Get health status (tests, docs, schema)
- `suggest_alternatives` - Find similar components
- `validate_design_tokens` - Check for hard-coded values

#### Acceptance Criteria

- [ ] Validation correctly identifies invalid prop values
- [ ] Enum values are strictly validated
- [ ] Required props are enforced
- [ ] Health checks report accurate status

#### Testing Approach

```bash
# Test in Claude Desktop:
# "Validate these Button props: {variant: 'invalid', size: 'sm'}"
# "Check the health of the Input component"
# "Suggest alternatives to the Button component"
```

---

### Phase 4: Advanced Features (Resources & Prompts)

**Duration**: 4-5 days
**Objective**: Provide rich context and guided workflows

#### Deliverables

1. MCP Resources for design tokens
2. MCP Prompts for common workflows
3. Bulk operations
4. Interactive form builder

#### Resources Included

- `component://registry/stats` - Registry statistics
- `tokens://colors` - Color design tokens
- `tokens://spacing` - Spacing tokens
- `tokens://typography` - Typography tokens
- `tokens://radius` - Border radius tokens
- `component://{name}/schema` - Component schema (dynamic)

#### Prompts Included

- `build-form` - Guided workflow for building a form
- `create-page` - Guided workflow for creating a page layout
- `component-selection` - Help choosing the right component

#### Additional Tools

- `get_design_tokens` - Get all design tokens with usage guidelines
- `get_form_components` - Get all form-related components with schemas
- `get_interactive_components` - Get all interactive components
- `bulk_validate` - Validate multiple component usages at once

#### Acceptance Criteria

- [ ] Resources provide real-time token values
- [ ] Prompts guide users through complex workflows
- [ ] Bulk operations handle multiple components efficiently
- [ ] Form workflow generates complete, validated forms

#### Testing Approach

```bash
# Test in Claude Desktop:
# "Use the build-form prompt to create a login form"
# "Show me all design tokens for colors"
# "Validate these three component usages together"
```

---

## 4. Technical Architecture

### Project Structure

```
src/mcp/
├── index.ts                 # Entry point, MCP server setup
├── server.ts                # MCP server configuration
├── tools/
│   ├── index.ts             # Tool registration
│   ├── discovery.ts         # Phase 1: Discovery tools
│   ├── generation.ts        # Phase 2: Code generation tools
│   ├── validation.ts        # Phase 3: Validation tools
│   └── advanced.ts          # Phase 4: Advanced tools
├── resources/
│   ├── index.ts             # Resource registration
│   ├── tokens.ts            # Design token resources
│   └── components.ts        # Component schema resources
├── prompts/
│   ├── index.ts             # Prompt registration
│   ├── build-form.ts        # Form builder prompt
│   └── create-page.ts       # Page creator prompt
└── utils/
    ├── agent-api-wrapper.ts # Wrapper around AgentAPI
    └── formatters.ts        # Output formatting utilities
```

### Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "vitest": "^1.0.0"
  }
}
```

### Integration with Existing Code

The MCP server will import and use the existing `AgentAPI` class:

```typescript
// src/mcp/utils/agent-api-wrapper.ts
import { AgentAPI } from '../../registry/agent-api'
import {
  validatePropsAgainstSchema,
  validateDesignTokens
} from '../../registry/validators'

export const agentAPI = new AgentAPI()

// Re-export for use in tools
export { agentAPI, validatePropsAgainstSchema, validateDesignTokens }
```

### Transport & Communication

- **Transport**: stdio (standard input/output)
- **Protocol**: JSON-RPC 2.0 via MCP SDK
- **Serialization**: JSON

---

## 5. Tool Specifications

### Phase 1 Tools

#### `discover_components`

**Description**: Discover components based on filters like category, tags, complexity, and documentation status.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["atom", "molecule", "organism", "template", "pattern"],
      "description": "Atomic design category"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Filter by tags (e.g., 'form', 'interactive', 'display')"
    },
    "complexity": {
      "type": "string",
      "enum": ["simple", "moderate", "complex"],
      "description": "Component complexity level"
    },
    "hasSchema": {
      "type": "boolean",
      "description": "Filter for components with/without schemas"
    },
    "hasDocumentation": {
      "type": "boolean",
      "description": "Filter for components with/without documentation"
    },
    "limit": {
      "type": "number",
      "description": "Maximum number of results to return",
      "default": 20
    }
  },
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "count": 9,
  "components": [
    {
      "name": "Button",
      "category": "atom",
      "description": "Interactive button with multiple variants and sizes",
      "tags": ["interactive", "form", "action"],
      "complexity": "simple",
      "hasSchema": true,
      "hasDocumentation": true,
      "path": "src/components/ui/button.tsx",
      "wcagLevel": "AA"
    }
  ]
}
```

**Example Usage**:
```
User: "Find all simple form atoms with documentation"

Tool call: discover_components({
  category: "atom",
  tags: ["form"],
  complexity: "simple",
  hasDocumentation: true
})
```

**Phase**: 1

---

#### `search_components`

**Description**: Search for components by keyword across names, descriptions, and tags.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search keyword",
      "minLength": 1
    },
    "limit": {
      "type": "number",
      "description": "Maximum results",
      "default": 10
    }
  },
  "required": ["query"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "query": "input",
  "count": 3,
  "results": [
    {
      "name": "Input",
      "description": "Text input field for forms",
      "relevance": "name",
      "category": "atom"
    }
  ]
}
```

**Example Usage**:
```
User: "Search for components related to navigation"

Tool call: search_components({ query: "navigation" })
```

**Phase**: 1

---

#### `get_component`

**Description**: Get complete metadata for a specific component by name.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name (case-insensitive)",
      "minLength": 1
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "name": "Button",
  "category": "atom",
  "path": "src/components/ui/button.tsx",
  "description": "Interactive button with multiple variants and sizes",
  "tags": ["interactive", "form", "action"],
  "complexity": "simple",
  "version": "1.0.0",
  "lastUpdated": "2025-11-17",
  "wcagLevel": "AA",
  "dependencies": {
    "internal": ["cn"],
    "external": ["@radix-ui/react-slot", "class-variance-authority"],
    "components": []
  },
  "schema": "src/components/atoms/button/Button.schema.json",
  "documentation": "src/components/atoms/button/Button.md",
  "hasTesting": true,
  "hasStorybook": false,
  "migrationStatus": "documented"
}
```

**Example Usage**:
```
User: "Tell me about the Select component"

Tool call: get_component({ name: "Select" })
```

**Phase**: 1

---

#### `get_registry_stats`

**Description**: Get overall statistics about the component registry.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {},
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "total": 60,
  "byCategory": {
    "atom": 25,
    "molecule": 20,
    "organism": 15
  },
  "byComplexity": {
    "simple": 35,
    "moderate": 18,
    "complex": 7
  },
  "documented": 9,
  "withTests": 1,
  "withStorybook": 0,
  "wcagCompliance": {
    "AA": 58,
    "AAA": 2
  }
}
```

**Example Usage**:
```
User: "How many components are in the registry?"

Tool call: get_registry_stats({})
```

**Phase**: 1

---

### Phase 2 Tools

#### `load_schema`

**Description**: Load the complete JSON schema for a component, including props, examples, and AI guidance.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "componentName": "Button",
  "category": "atom",
  "description": "A versatile button component...",
  "version": "1.0.0",
  "props": {
    "variant": {
      "type": "enum",
      "values": ["default", "destructive", "outline", "secondary", "ghost", "link"],
      "default": "default",
      "description": "Visual style variant"
    },
    "size": {
      "type": "enum",
      "values": ["default", "sm", "lg", "icon"],
      "default": "default"
    },
    "disabled": {
      "type": "boolean",
      "default": false
    },
    "children": {
      "type": "ReactNode",
      "required": true
    }
  },
  "accessibility": {
    "ariaSupport": true,
    "keyboardNavigation": true,
    "wcagLevel": "AA"
  },
  "examples": [...],
  "aiGuidance": {
    "whenToUse": "...",
    "whenNotToUse": "...",
    "commonMistakes": [...]
  }
}
```

**Example Usage**:
```
User: "What are all the props for the Button component?"

Tool call: load_schema({ name: "Button" })
```

**Phase**: 2

---

#### `generate_import`

**Description**: Generate a correct import statement for a component.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    },
    "includeTypes": {
      "type": "boolean",
      "description": "Include type imports",
      "default": false
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "import": "import { Button } from '@/components/ui/button'",
  "typeImport": "import type { ButtonProps } from '@/components/ui/button'",
  "path": "@/components/ui/button"
}
```

**Example Usage**:
```
User: "Generate the import for Checkbox"

Tool call: generate_import({ name: "Checkbox" })
```

**Phase**: 2

---

#### `generate_usage`

**Description**: Generate JSX usage code for a component with specified props.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    },
    "props": {
      "type": "object",
      "description": "Props to include in the usage example",
      "additionalProperties": true
    },
    "children": {
      "type": "string",
      "description": "Children content"
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "usage": "<Button variant=\"destructive\" size=\"lg\">Delete</Button>",
  "import": "import { Button } from '@/components/ui/button'",
  "complete": "import { Button } from '@/components/ui/button'\n\n<Button variant=\"destructive\" size=\"lg\">Delete</Button>"
}
```

**Example Usage**:
```
User: "Generate a destructive large button"

Tool call: generate_usage({
  name: "Button",
  props: { variant: "destructive", size: "lg" },
  children: "Delete"
})
```

**Phase**: 2

---

#### `get_component_examples`

**Description**: Get code examples from component schema.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    },
    "pattern": {
      "type": "string",
      "description": "Filter by pattern name"
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "componentName": "Button",
  "examples": [
    {
      "name": "Primary Action",
      "description": "Default button for primary actions",
      "code": "<Button variant=\"default\">Save Changes</Button>"
    }
  ],
  "compositionPatterns": [
    {
      "pattern": "Form Submit Button",
      "description": "Button for form submission with loading state",
      "example": "<form onSubmit={handleSubmit}>..."
    }
  ]
}
```

**Phase**: 2

---

### Phase 3 Tools

#### `validate_props`

**Description**: Validate a props object against a component's schema.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    },
    "props": {
      "type": "object",
      "description": "Props object to validate",
      "additionalProperties": true
    }
  },
  "required": ["name", "props"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "valid": false,
  "componentName": "Button",
  "errors": [
    {
      "prop": "variant",
      "value": "invalid",
      "error": "Invalid value for prop \"variant\"",
      "expected": ["default", "destructive", "outline", "secondary", "ghost", "link"]
    }
  ],
  "warnings": [
    {
      "prop": "customProp",
      "value": "test",
      "error": "Prop not defined in schema (may be a valid HTML attribute)"
    }
  ]
}
```

**Example Usage**:
```
User: "Validate these props for Button: {variant: 'primary', size: 'medium'}"

Tool call: validate_props({
  name: "Button",
  props: { variant: "primary", size: "medium" }
})
```

**Phase**: 3

---

#### `get_component_health`

**Description**: Get health status of a component including tests, docs, and schema status.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "name": "Button",
  "status": "healthy",
  "hasTests": true,
  "hasStorybook": false,
  "hasSchema": true,
  "hasDocumentation": true,
  "coverage": 85,
  "migrationStatus": "documented",
  "issues": [
    "No Storybook stories"
  ]
}
```

**Phase**: 3

---

#### `suggest_alternatives`

**Description**: Suggest alternative components that might serve a similar purpose.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "minLength": 1
    },
    "context": {
      "type": "string",
      "description": "Usage context for better suggestions"
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "component": "Button",
  "alternatives": [
    {
      "name": "Link",
      "reason": "For navigation to different pages/routes",
      "sharedTags": ["interactive", "action"]
    }
  ]
}
```

**Phase**: 3

---

#### `validate_design_tokens`

**Description**: Check if a className uses design tokens correctly.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "className": {
      "type": "string",
      "description": "Tailwind class string to validate"
    }
  },
  "required": ["className"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "valid": false,
  "hardCodedValues": ["bg-blue-500", "[padding:20px]"],
  "warnings": [
    "Hard-coded color found: \"bg-blue-500\". Use semantic tokens instead.",
    "Arbitrary value found: \"[padding:20px]\". Use design tokens instead."
  ],
  "suggestions": [
    "Use bg-primary instead of bg-blue-500",
    "Use p-5 instead of [padding:20px]"
  ]
}
```

**Phase**: 3

---

### Phase 4 Tools

#### `get_design_tokens`

**Description**: Get all design tokens with their values and usage guidelines.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["colors", "spacing", "typography", "radius", "all"],
      "description": "Token category",
      "default": "all"
    }
  },
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "colors": {
    "tokens": {
      "primary": "var(--color-primary)",
      "secondary": "var(--color-secondary)"
    },
    "guidelines": {
      "primary": "Main brand color, use for primary actions",
      "destructive": "Destructive actions, error states"
    },
    "usage": "className=\"bg-primary text-primary-foreground\""
  },
  "spacing": {...},
  "typography": {...},
  "radius": {...}
}
```

**Phase**: 4

---

#### `get_form_components`

**Description**: Get all form-related components with their schemas for building forms.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "includeSchemas": {
      "type": "boolean",
      "description": "Include full schemas",
      "default": false
    }
  },
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "count": 8,
  "components": [
    {
      "name": "Input",
      "description": "Text input field",
      "schema": {...}
    },
    {
      "name": "Checkbox",
      "description": "Checkbox for boolean values"
    }
  ],
  "formPatterns": [
    {
      "name": "Login Form",
      "components": ["Input", "Button", "Checkbox"],
      "example": "..."
    }
  ]
}
```

**Phase**: 4

---

#### `bulk_validate`

**Description**: Validate multiple component usages at once.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "props": { "type": "object" }
        },
        "required": ["name", "props"]
      },
      "description": "Array of component usages to validate"
    }
  },
  "required": ["components"],
  "additionalProperties": false
}
```

**Output Format**:
```json
{
  "valid": false,
  "results": [
    {
      "name": "Button",
      "valid": true,
      "errors": []
    },
    {
      "name": "Input",
      "valid": false,
      "errors": [
        {
          "prop": "type",
          "error": "Invalid value"
        }
      ]
    }
  ],
  "summary": {
    "total": 2,
    "passed": 1,
    "failed": 1
  }
}
```

**Phase**: 4

---

## 6. Testing Strategy

### Unit Testing

Each tool will have unit tests covering:
- Valid input handling
- Error cases (missing required fields, invalid values)
- Edge cases (empty arrays, undefined values)
- Output format correctness

```typescript
// Example unit test
describe('discover_components', () => {
  it('filters by category', async () => {
    const result = await discoverComponents({ category: 'atom' })
    expect(result.components.every(c => c.category === 'atom')).toBe(true)
  })

  it('filters by multiple tags', async () => {
    const result = await discoverComponents({ tags: ['form', 'interactive'] })
    expect(result.components.length).toBeGreaterThan(0)
  })

  it('returns empty array for no matches', async () => {
    const result = await discoverComponents({ tags: ['nonexistent'] })
    expect(result.components).toHaveLength(0)
  })
})
```

### Integration Testing

Test complete workflows:

1. **Discovery to Generation Flow**:
   - Discover components with filters
   - Get component details
   - Load schema
   - Generate usage code
   - Validate generated props

2. **Form Building Flow**:
   - Get form components
   - Load schemas for each
   - Generate complete form
   - Validate all props

### Claude Desktop Testing

Each phase has manual test scenarios:

#### Phase 1 Tests
```
1. "What components are available for forms?"
2. "Show me all atoms with documentation"
3. "Search for button-related components"
4. "How many components are in each category?"
```

#### Phase 2 Tests
```
1. "Load the Input schema and explain the props"
2. "Generate a secondary large button with icon"
3. "Show me the examples for Select"
4. "What's the correct import for Textarea?"
```

#### Phase 3 Tests
```
1. "Validate: Button with variant='primary' and size='medium'"
2. "Check the health of all documented components"
3. "Is this import correct: import { Button } from './button'"
4. "What alternatives are there to Switch?"
```

#### Phase 4 Tests
```
1. "Show me all color tokens with usage guidelines"
2. "Build a login form with email, password, and remember me"
3. "Validate these three components together..."
4. "Use the create-page prompt for a settings page"
```

### MCP Inspector Testing

```bash
# Install MCP inspector
npm install -g @anthropic-ai/mcp-inspector

# Run server with inspector
npx @anthropic-ai/mcp-inspector npx tsx src/mcp/index.ts

# Test individual tools in the inspector UI
```

---

## 7. Configuration & Deployment

### Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shadcn-components": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/shadcn-admin/src/mcp/index.ts"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

Or with built version:

```json
{
  "mcpServers": {
    "shadcn-components": {
      "command": "node",
      "args": ["/absolute/path/to/shadcn-admin/dist/mcp/index.js"]
    }
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "mcp:dev": "tsx watch src/mcp/index.ts",
    "mcp:build": "tsc -p tsconfig.mcp.json",
    "mcp:start": "node dist/mcp/index.js",
    "mcp:test": "vitest src/mcp/",
    "mcp:inspector": "npx @anthropic-ai/mcp-inspector npx tsx src/mcp/index.ts"
  }
}
```

---

## 8. Future Enhancements

### Short-term (Post-Phase 4)

1. **Visual Preview Generation**
   - Generate component previews as images
   - Show variants side-by-side

2. **Real-time Component File Watching**
   - Update registry when components change
   - Notify clients of schema updates

3. **Storybook Integration**
   - Link to Storybook stories
   - Pull examples from stories

### Medium-term

1. **Custom Component Registration**
   - Allow users to register their own components
   - Validate custom schemas

2. **Template Library**
   - Pre-built page templates
   - Complex layout patterns

3. **Accessibility Auditing**
   - Deep WCAG compliance checking
   - ARIA attribute validation

### Long-term

1. **Multi-Design-System Support**
   - Support multiple design systems
   - Theme switching

2. **AI Training Data Export**
   - Export component data for fine-tuning
   - Usage pattern analysis

3. **Code Diff Generation**
   - Generate migration diffs
   - Version upgrade assistance

---

## Appendix A: Component Metadata Structure

```typescript
interface ComponentMetadata {
  name: string                // PascalCase name
  category: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern'
  path: string                // Source file path
  schema: string | null       // Schema file path
  documentation: string | null // Documentation file path
  internalDependencies: string[] // Internal utils
  externalDependencies: string[] // npm packages
  componentDependencies: string[] // Other components
  tags: string[]              // Searchable tags
  complexity: 'simple' | 'moderate' | 'complex'
  lastUpdated: string         // ISO date
  version: string             // Semver
  description: string         // Brief description
  wcagLevel: 'A' | 'AA' | 'AAA'
  hasTesting: boolean
  hasStorybook: boolean
  migrationStatus: 'pending' | 'documented' | 'integrated'
}
```

---

## Appendix B: Error Codes

| Code | Description |
|------|-------------|
| `COMPONENT_NOT_FOUND` | Component name not in registry |
| `SCHEMA_NOT_AVAILABLE` | Component has no schema |
| `VALIDATION_ERROR` | Props validation failed |
| `INVALID_CATEGORY` | Unknown component category |
| `MISSING_REQUIRED_PROP` | Required prop not provided |

---

## Appendix C: Glossary

- **MCP**: Model Context Protocol - Standard for AI-to-tool communication
- **Atomic Design**: Design methodology (atoms, molecules, organisms)
- **WCAG**: Web Content Accessibility Guidelines
- **Design Tokens**: Standardized design values (colors, spacing, etc.)

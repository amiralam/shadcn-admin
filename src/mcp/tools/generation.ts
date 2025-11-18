/**
 * Phase 2: Schema Loading & Code Generation Tools
 *
 * These tools enable AI agents to generate correct component code.
 */

import { z } from 'zod'
import { agentAPI } from '../utils/agent-api-wrapper'

// Tool input schemas using Zod
export const loadSchemaSchema = {
  name: z.string().min(1).describe('Component name')
}

export const loadDocumentationSchema = {
  name: z.string().min(1).describe('Component name')
}

export const generateImportSchema = {
  name: z.string().min(1).describe('Component name'),
  includeTypes: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include type imports')
}

export const generateUsageSchema = {
  name: z.string().min(1).describe('Component name'),
  props: z
    .record(z.unknown())
    .optional()
    .describe('Props to include in the usage example'),
  children: z.string().optional().describe('Children content')
}

export const getComponentExamplesSchema = {
  name: z.string().min(1).describe('Component name'),
  pattern: z.string().optional().describe('Filter by pattern name')
}

// Type definitions
type LoadSchemaInput = {
  name: string
}

type LoadDocumentationInput = {
  name: string
}

type GenerateImportInput = {
  name: string
  includeTypes?: boolean
}

type GenerateUsageInput = {
  name: string
  props?: Record<string, unknown>
  children?: string
}

type GetComponentExamplesInput = {
  name: string
  pattern?: string
}

// Tool handlers
export async function loadSchema(input: LoadSchemaInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`
    }
  }

  const schema = await agentAPI.loadSchema(input.name)

  if (!schema) {
    return {
      error: 'SCHEMA_NOT_AVAILABLE',
      message: `No schema available for component "${input.name}"`,
      component: component.name,
      hasSchema: false
    }
  }

  return {
    componentName: component.name,
    category: component.category,
    schema: schema
  }
}

export async function loadDocumentation(input: LoadDocumentationInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`
    }
  }

  const documentation = await agentAPI.loadDocumentation(input.name)

  if (!documentation) {
    return {
      error: 'DOCUMENTATION_NOT_AVAILABLE',
      message: `No documentation available for component "${input.name}"`,
      component: component.name,
      hasDocumentation: false
    }
  }

  return {
    componentName: component.name,
    documentation: documentation,
    path: component.documentation
  }
}

export function generateImport(input: GenerateImportInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`
    }
  }

  const importStatement = agentAPI.generateImport(input.name, {
    includeTypes: input.includeTypes
  })

  // Generate type import if requested
  let typeImport: string | null = null
  if (input.includeTypes) {
    typeImport = `import type { ${component.name}Props } from '${getImportPath(component.path)}'`
  }

  return {
    import: importStatement,
    typeImport: typeImport,
    path: getImportPath(component.path)
  }
}

export function generateUsage(input: GenerateUsageInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`
    }
  }

  // Build props with children if provided
  const props = input.props || {}

  const usage = agentAPI.generateUsage(input.name, props)
  const importStatement = agentAPI.generateImport(input.name)

  // Generate complete code with import
  let usageWithChildren = usage
  if (input.children) {
    // Replace self-closing tag or empty content with children
    if (usage.includes('/>')) {
      usageWithChildren = usage.replace('/>', `>${input.children}</${component.name}>`)
    } else if (usage.includes(`></${component.name}>`)) {
      usageWithChildren = usage.replace(`></${component.name}>`, `>${input.children}</${component.name}>`)
    }
  }

  const complete = `${importStatement}\n\n${usageWithChildren}`

  return {
    usage: usageWithChildren,
    import: importStatement,
    complete: complete
  }
}

export async function getComponentExamples(input: GetComponentExamplesInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`
    }
  }

  const schema = await agentAPI.loadSchema(input.name)

  if (!schema) {
    return {
      error: 'SCHEMA_NOT_AVAILABLE',
      message: `No schema available for component "${input.name}"`,
      component: component.name,
      examples: [],
      compositionPatterns: []
    }
  }

  // Extract examples from schema
  let examples = schema.examples || []
  let compositionPatterns = schema.aiGuidance?.compositionPatterns || []

  // Filter by pattern name if provided
  if (input.pattern) {
    const patternLower = input.pattern.toLowerCase()
    examples = examples.filter(
      (ex: { name?: string; description?: string }) =>
        ex.name?.toLowerCase().includes(patternLower) ||
        ex.description?.toLowerCase().includes(patternLower)
    )
    compositionPatterns = compositionPatterns.filter(
      (cp: { pattern?: string; description?: string }) =>
        cp.pattern?.toLowerCase().includes(patternLower) ||
        cp.description?.toLowerCase().includes(patternLower)
    )
  }

  return {
    componentName: component.name,
    examples: examples,
    compositionPatterns: compositionPatterns
  }
}

// Helper function to convert file path to import path
function getImportPath(filePath: string): string {
  // Convert src/components/ui/button.tsx to @/components/ui/button
  return filePath
    .replace(/^src\//, '@/')
    .replace(/\.tsx?$/, '')
}

// Tool definitions for MCP registration
export const generationTools = [
  {
    name: 'load_schema',
    description:
      'Load the complete JSON schema for a component, including props, examples, and AI guidance. Use this to understand all available props and their types.',
    schema: loadSchemaSchema,
    handler: loadSchema
  },
  {
    name: 'load_documentation',
    description:
      'Load the documentation for a component. Returns markdown documentation with usage guidelines and best practices.',
    schema: loadDocumentationSchema,
    handler: loadDocumentation
  },
  {
    name: 'generate_import',
    description:
      'Generate a correct import statement for a component. Uses @/ path aliases as per project conventions.',
    schema: generateImportSchema,
    handler: generateImport
  },
  {
    name: 'generate_usage',
    description:
      'Generate JSX usage code for a component with specified props. Returns ready-to-use code with proper formatting.',
    schema: generateUsageSchema,
    handler: generateUsage
  },
  {
    name: 'get_component_examples',
    description:
      'Get code examples from a component schema. Includes basic examples and composition patterns for common use cases.',
    schema: getComponentExamplesSchema,
    handler: getComponentExamples
  }
]

/**
 * Phase 1: Discovery Tools
 *
 * These tools enable AI agents to discover and explore the component library.
 */

import { z } from 'zod'
import { agentAPI } from '../utils/agent-api-wrapper'
import {
  formatComponentSummary,
  formatComponentDetail,
  formatSearchResult
} from '../utils/formatters'

// Tool input schemas using Zod
export const discoverComponentsSchema = {
  category: z
    .enum(['atom', 'molecule', 'organism', 'template', 'pattern'])
    .optional()
    .describe('Atomic design category'),
  tags: z
    .array(z.string())
    .optional()
    .describe("Filter by tags (e.g., 'form', 'interactive', 'display')"),
  complexity: z
    .enum(['simple', 'moderate', 'complex'])
    .optional()
    .describe('Component complexity level'),
  hasSchema: z
    .boolean()
    .optional()
    .describe('Filter for components with/without schemas'),
  hasDocumentation: z
    .boolean()
    .optional()
    .describe('Filter for components with/without documentation'),
  limit: z
    .number()
    .optional()
    .default(20)
    .describe('Maximum number of results to return')
}

export const searchComponentsSchema = {
  query: z.string().min(1).describe('Search keyword'),
  limit: z.number().optional().default(10).describe('Maximum results')
}

export const getComponentSchema = {
  name: z.string().min(1).describe('Component name (case-insensitive)')
}

export const getRegistryStatsSchema = {}

export const listByCategorySchema = {
  limit: z
    .number()
    .optional()
    .default(50)
    .describe('Maximum number of results to return')
}

// Infer types from schemas
type DiscoverComponentsInput = {
  category?: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern'
  tags?: string[]
  complexity?: 'simple' | 'moderate' | 'complex'
  hasSchema?: boolean
  hasDocumentation?: boolean
  limit?: number
}

type SearchComponentsInput = {
  query: string
  limit?: number
}

type GetComponentInput = {
  name: string
}

type ListByCategoryInput = {
  limit?: number
}

// Tool handlers
export async function discoverComponents(input: DiscoverComponentsInput) {
  const filters = {
    category: input.category,
    tags: input.tags,
    complexity: input.complexity,
    hasSchema: input.hasSchema,
    hasDocumentation: input.hasDocumentation
  }

  const components = await agentAPI.discoverComponents(filters)
  const limited = components.slice(0, input.limit || 20)

  return {
    count: limited.length,
    totalMatches: components.length,
    components: limited.map(formatComponentSummary)
  }
}

export async function searchComponents(input: SearchComponentsInput) {
  const components = await agentAPI.searchComponents(input.query)
  const limited = components.slice(0, input.limit || 10)

  return {
    query: input.query,
    count: limited.length,
    results: limited.map((c) => formatSearchResult(c, input.query))
  }
}

export function getComponent(input: GetComponentInput) {
  const component = agentAPI.getComponent(input.name)

  if (!component) {
    return {
      error: 'COMPONENT_NOT_FOUND',
      message: `Component "${input.name}" not found in registry`,
      suggestions: getSuggestions(input.name)
    }
  }

  return formatComponentDetail(component)
}

export function getRegistryStats() {
  return agentAPI.getStats()
}

export function listAtoms(input: ListByCategoryInput) {
  const components = agentAPI.getAtoms()
  const limited = components.slice(0, input.limit || 50)

  return {
    category: 'atom',
    count: limited.length,
    total: components.length,
    components: limited.map(formatComponentSummary)
  }
}

export function listMolecules(input: ListByCategoryInput) {
  const components = agentAPI.getMolecules()
  const limited = components.slice(0, input.limit || 50)

  return {
    category: 'molecule',
    count: limited.length,
    total: components.length,
    components: limited.map(formatComponentSummary)
  }
}

export function listOrganisms(input: ListByCategoryInput) {
  const components = agentAPI.getOrganisms()
  const limited = components.slice(0, input.limit || 50)

  return {
    category: 'organism',
    count: limited.length,
    total: components.length,
    components: limited.map(formatComponentSummary)
  }
}

// Helper function for suggestions
function getSuggestions(name: string): string[] {
  const all = agentAPI.getAllComponents()
  const lowerName = name.toLowerCase()

  return all
    .filter((c) => {
      const cName = c.name.toLowerCase()
      return (
        cName.includes(lowerName) ||
        lowerName.includes(cName) ||
        levenshteinDistance(cName, lowerName) <= 3
      )
    })
    .slice(0, 5)
    .map((c) => c.name)
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Tool definitions for MCP registration
export const discoveryTools = [
  {
    name: 'discover_components',
    description:
      'Discover components based on filters like category, tags, complexity, and documentation status. Use this to find components matching specific criteria.',
    schema: discoverComponentsSchema,
    handler: discoverComponents
  },
  {
    name: 'search_components',
    description:
      'Search for components by keyword across names, descriptions, and tags. Returns relevant results with relevance indicators.',
    schema: searchComponentsSchema,
    handler: searchComponents
  },
  {
    name: 'get_component',
    description:
      'Get complete metadata for a specific component by name. Returns detailed information including path, dependencies, and health status.',
    schema: getComponentSchema,
    handler: getComponent
  },
  {
    name: 'get_registry_stats',
    description:
      'Get overall statistics about the component registry including counts by category, complexity, and documentation status.',
    schema: getRegistryStatsSchema,
    handler: getRegistryStats
  },
  {
    name: 'list_atoms',
    description:
      'List all atom components (basic building blocks like buttons, inputs, labels).',
    schema: listByCategorySchema,
    handler: listAtoms
  },
  {
    name: 'list_molecules',
    description:
      'List all molecule components (combinations of atoms like form groups, cards).',
    schema: listByCategorySchema,
    handler: listMolecules
  },
  {
    name: 'list_organisms',
    description:
      'List all organism components (complex UI sections like navigation, sidebars).',
    schema: listByCategorySchema,
    handler: listOrganisms
  }
]

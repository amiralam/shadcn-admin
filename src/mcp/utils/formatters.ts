/**
 * Output Formatters for MCP Server
 *
 * These utilities format component data for MCP tool responses.
 */

import type { ComponentMetadata } from '../../registry/component-registry'

/**
 * Format component metadata for discovery results
 */
export function formatComponentSummary(component: ComponentMetadata) {
  return {
    name: component.name,
    category: component.category,
    description: component.description,
    tags: component.tags,
    complexity: component.complexity,
    hasSchema: Boolean(component.schema),
    hasDocumentation: Boolean(component.documentation),
    path: component.path,
    wcagLevel: component.wcagLevel
  }
}

/**
 * Format component metadata for detailed view
 */
export function formatComponentDetail(component: ComponentMetadata) {
  return {
    name: component.name,
    category: component.category,
    path: component.path,
    description: component.description,
    tags: component.tags,
    complexity: component.complexity,
    version: component.version,
    lastUpdated: component.lastUpdated,
    wcagLevel: component.wcagLevel,
    dependencies: {
      internal: component.internalDependencies,
      external: component.externalDependencies,
      components: component.componentDependencies
    },
    schema: component.schema || null,
    documentation: component.documentation || null,
    hasTesting: component.hasTesting,
    hasStorybook: component.hasStorybook,
    migrationStatus: (component as ComponentMetadata & { migrationStatus?: string }).migrationStatus || 'pending'
  }
}

/**
 * Format search result with relevance indicator
 */
export function formatSearchResult(
  component: ComponentMetadata,
  query: string
): {
  name: string
  description: string
  relevance: 'name' | 'description' | 'tag'
  category: string
} {
  const lowerQuery = query.toLowerCase()
  let relevance: 'name' | 'description' | 'tag' = 'description'

  if (component.name.toLowerCase().includes(lowerQuery)) {
    relevance = 'name'
  } else if (component.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
    relevance = 'tag'
  }

  return {
    name: component.name,
    description: component.description,
    relevance,
    category: component.category
  }
}

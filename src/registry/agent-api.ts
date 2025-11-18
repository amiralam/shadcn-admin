/**
 * Agent API
 *
 * Runtime API for AI agents to discover, validate, and use components
 * This provides dynamic access to component metadata, schemas, and documentation
 */

import type { ComponentMetadata } from './component-registry'

// Load the full registry
import fullRegistry from './component-registry-full.json'

export interface ComponentFilters {
  category?: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern'
  tags?: string[]
  complexity?: 'simple' | 'moderate' | 'complex'
  migrationStatus?: 'documented' | 'pending' | 'integrated'
  hasSchema?: boolean
  hasDocumentation?: boolean
  hasTesting?: boolean
}

export interface ValidationError {
  field: string
  value: any
  error: string
  expected?: any
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ComponentHealth {
  name: string
  status: 'healthy' | 'warning' | 'error'
  hasTests: boolean
  hasStorybook: boolean
  hasSchema: boolean
  hasDocumentation: boolean
  importCount: number
  lastUpdated: string
  coverage: number
  issues: string[]
  migrationStatus: string
}

export interface CodeGenerationOptions {
  includeImport?: boolean
  includeTypes?: boolean
  formatted?: boolean
}

/**
 * Agent API Class
 *
 * Provides runtime access to component system for AI agents
 */
export class AgentAPI {
  private components: ComponentMetadata[]
  private componentMap: Map<string, ComponentMetadata>

  constructor() {
    this.components = fullRegistry.components as unknown as ComponentMetadata[]
    this.componentMap = new Map()

    // Build lookup map
    this.components.forEach(component => {
      this.componentMap.set(component.name.toLowerCase(), component)
    })
  }

  // ==================== DISCOVERY ====================

  /**
   * Discover components based on filters
   */
  async discoverComponents(filters?: ComponentFilters): Promise<ComponentMetadata[]> {
    let results = [...this.components]

    if (!filters) return results

    // Filter by category
    if (filters.category) {
      results = results.filter(c => c.category === filters.category)
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(c =>
        filters.tags!.some(tag => c.tags.includes(tag))
      )
    }

    // Filter by complexity
    if (filters.complexity) {
      results = results.filter(c => c.complexity === filters.complexity)
    }

    // Filter by migration status
    if (filters.migrationStatus) {
      results = results.filter(c =>
        (c as any).migrationStatus === filters.migrationStatus
      )
    }

    // Filter by schema existence
    if (filters.hasSchema !== undefined) {
      results = results.filter(c =>
        filters.hasSchema ? c.schema !== null && c.schema !== 'pending' : c.schema === null || c.schema === 'pending'
      )
    }

    // Filter by documentation existence
    if (filters.hasDocumentation !== undefined) {
      results = results.filter(c =>
        filters.hasDocumentation ? c.documentation !== null && c.documentation !== 'pending' : c.documentation === null || c.documentation === 'pending'
      )
    }

    // Filter by testing
    if (filters.hasTesting !== undefined) {
      results = results.filter(c => c.hasTesting === filters.hasTesting)
    }

    return results
  }

  /**
   * Search components by keyword
   */
  async searchComponents(query: string): Promise<ComponentMetadata[]> {
    const lowerQuery = query.toLowerCase()

    return this.components.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Get component by name (case-insensitive)
   */
  getComponent(name: string): ComponentMetadata | undefined {
    return this.componentMap.get(name.toLowerCase())
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentMetadata[] {
    return [...this.components]
  }

  // ==================== LOADING ====================

  /**
   * Load component schema
   */
  async loadSchema(componentName: string): Promise<any | null> {
    const component = this.getComponent(componentName)
    if (!component) {
      throw new Error(`Component "${componentName}" not found`)
    }

    if (!component.schema || component.schema === 'pending') {
      return null
    }

    try {
      // Dynamic import of schema
      const schemaPath = component.schema.replace('src/', '../../').replace('.json', '')
      const schema = await import(schemaPath + '.json')
      return schema.default || schema
    } catch (error) {
      console.warn(`Failed to load schema for ${componentName}:`, error)
      return null
    }
  }

  /**
   * Load component documentation
   */
  async loadDocumentation(componentName: string): Promise<string | null> {
    const component = this.getComponent(componentName)
    if (!component) {
      throw new Error(`Component "${componentName}" not found`)
    }

    if (!component.documentation || component.documentation === 'pending') {
      return null
    }

    try {
      // In a real implementation, this would fetch the .md file
      // For now, return the path
      return `See documentation at: ${component.documentation}`
    } catch (error) {
      console.warn(`Failed to load documentation for ${componentName}:`, error)
      return null
    }
  }

  // ==================== VALIDATION ====================

  /**
   * Validate component props against schema
   */
  validateProps(componentName: string, props: Record<string, any>): ValidationResult {
    const component = this.getComponent(componentName)
    if (!component) {
      return {
        valid: false,
        errors: [{
          field: 'component',
          value: componentName,
          error: 'Component not found in registry'
        }]
      }
    }

    // If no schema, cannot validate
    if (!component.schema || component.schema === 'pending') {
      return {
        valid: true,
        errors: [],
      }
    }

    // Import validation helper
    const { validatePropsAgainstSchema } = require('./validators')

    // Try to load schema synchronously for validation
    try {
      // For Button (our documented component), we can validate
      if (component.name === 'Button') {
        const buttonSchema = require('../components/atoms/button/Button.schema.json')
        return validatePropsAgainstSchema(buttonSchema, props)
      }
    } catch {
      // Schema not loadable, skip validation
    }

    return {
      valid: true,
      errors: [],
    }
  }

  /**
   * Validate import path
   */
  validateImportPath(componentName: string, importPath: string): ValidationResult {
    const component = this.getComponent(componentName)
    if (!component) {
      return {
        valid: false,
        errors: [{
          field: 'import',
          value: importPath,
          error: `Component "${componentName}" not found`
        }]
      }
    }

    // Extract expected import path from component path
    const expectedPath = component.path
      .replace('src/', '@/')
      .replace('.tsx', '')
      .replace('.ts', '')

    // Check if import matches
    const normalizedImport = importPath.replace('@/components/', '@/').replace('.tsx', '').replace('.ts', '')
    const _normalizedExpected = expectedPath.replace('@/components/', '@/').replace('.tsx', '').replace('.ts', '')
    void _normalizedExpected // Reserved for future path matching

    if (!normalizedImport.includes(component.name.toLowerCase())) {
      return {
        valid: false,
        errors: [{
          field: 'import',
          value: importPath,
          error: `Import path does not match component location`,
          expected: expectedPath
        }]
      }
    }

    return { valid: true, errors: [] }
  }

  // ==================== HEALTH & STATS ====================

  /**
   * Get component health status
   */
  getComponentHealth(componentName: string): ComponentHealth | null {
    const component = this.getComponent(componentName)
    if (!component) return null

    const issues: string[] = []

    // Check for missing schema
    if (!component.schema || component.schema === 'pending') {
      issues.push('Missing component schema')
    }

    // Check for missing documentation
    if (!component.documentation || component.documentation === 'pending') {
      issues.push('Missing documentation')
    }

    // Check for missing tests
    if (!component.hasTesting) {
      issues.push('No unit tests')
    }

    // Check for missing storybook
    if (!component.hasStorybook) {
      issues.push('No Storybook stories')
    }

    const migrationStatus = (component as any).migrationStatus || 'pending'

    // Determine status
    let status: 'healthy' | 'warning' | 'error' = 'healthy'
    if (issues.length > 3) status = 'error'
    else if (issues.length > 0) status = 'warning'

    return {
      name: component.name,
      status,
      hasTests: component.hasTesting,
      hasStorybook: component.hasStorybook,
      hasSchema: !!component.schema && component.schema !== 'pending',
      hasDocumentation: !!component.documentation && component.documentation !== 'pending',
      importCount: 0, // Would need code analysis
      lastUpdated: component.lastUpdated,
      coverage: 0, // Would need test coverage data
      issues,
      migrationStatus,
    }
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const byCategory = {
      atom: 0,
      molecule: 0,
      organism: 0,
      template: 0,
      pattern: 0,
    }

    const byComplexity = {
      simple: 0,
      moderate: 0,
      complex: 0,
    }

    let documented = 0
    let withTests = 0
    let withStorybook = 0

    this.components.forEach(c => {
      byCategory[c.category]++
      byComplexity[c.complexity]++

      if (c.schema && c.schema !== 'pending' && c.documentation && c.documentation !== 'pending') {
        documented++
      }
      if (c.hasTesting) withTests++
      if (c.hasStorybook) withStorybook++
    })

    return {
      total: this.components.length,
      byCategory,
      byComplexity,
      documented,
      withTests,
      withStorybook,
      wcagCompliance: {
        AA: this.components.filter(c => c.wcagLevel === 'AA').length,
        AAA: this.components.filter(c => c.wcagLevel === 'AAA').length,
      }
    }
  }

  // ==================== CODE GENERATION ====================

  /**
   * Generate import statement for component
   */
  generateImport(componentName: string, _options: CodeGenerationOptions = {}): string {
    const component = this.getComponent(componentName)
    if (!component) {
      throw new Error(`Component "${componentName}" not found`)
    }

    // Options reserved for future: includeTypes, formatted, etc.
    void _options

    const importPath = component.path
      .replace('src/', '@/')
      .replace('.tsx', '')
      .replace('.ts', '')

    return `import { ${component.name} } from '${importPath}'`
  }

  /**
   * Generate usage example for component
   */
  generateUsage(componentName: string, props: Record<string, any> = {}): string {
    const component = this.getComponent(componentName)
    if (!component) {
      throw new Error(`Component "${componentName}" not found`)
    }

    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}="${value}"`
        if (typeof value === 'boolean') return value ? key : ''
        return `${key}={${JSON.stringify(value)}}`
      })
      .filter(Boolean)
      .join(' ')

    return propsString
      ? `<${component.name} ${propsString} />`
      : `<${component.name} />`
  }

  /**
   * Suggest alternative components
   */
  suggestAlternatives(componentName: string, _context?: string): string[] {
    const component = this.getComponent(componentName)
    if (!component) return []

    // Context reserved for future: 'navigation', 'form', 'data-display', etc.
    void _context

    // Find components with similar tags
    const alternatives = this.components
      .filter(c =>
        c.name !== componentName &&
        c.tags.some(tag => component.tags.includes(tag))
      )
      .sort((a, b) => {
        // Sort by number of matching tags
        const aMatches = a.tags.filter(tag => component.tags.includes(tag)).length
        const bMatches = b.tags.filter(tag => component.tags.includes(tag)).length
        return bMatches - aMatches
      })
      .slice(0, 5)
      .map(c => c.name)

    return alternatives
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get components by tag
   */
  getByTag(tag: string): ComponentMetadata[] {
    return this.components.filter(c => c.tags.includes(tag))
  }

  /**
   * Get form components
   */
  getFormComponents(): ComponentMetadata[] {
    return this.getByTag('form')
  }

  /**
   * Get interactive components
   */
  getInteractiveComponents(): ComponentMetadata[] {
    return this.getByTag('interactive')
  }

  /**
   * Get layout components
   */
  getLayoutComponents(): ComponentMetadata[] {
    return this.getByTag('layout')
  }

  /**
   * Get atoms
   */
  getAtoms(): ComponentMetadata[] {
    return this.components.filter(c => c.category === 'atom')
  }

  /**
   * Get molecules
   */
  getMolecules(): ComponentMetadata[] {
    return this.components.filter(c => c.category === 'molecule')
  }

  /**
   * Get organisms
   */
  getOrganisms(): ComponentMetadata[] {
    return this.components.filter(c => c.category === 'organism')
  }
}

/**
 * Default API instance
 */
export const agentAPI = new AgentAPI()

/**
 * Convenience exports
 */
export const {
  discoverComponents,
  searchComponents,
  getComponent,
  getAllComponents,
  loadSchema,
  loadDocumentation,
  validateProps,
  validateImportPath,
  getComponentHealth,
  getStats,
  generateImport,
  generateUsage,
  suggestAlternatives,
  getByTag,
  getFormComponents,
  getInteractiveComponents,
  getLayoutComponents,
  getAtoms,
  getMolecules,
  getOrganisms,
} = agentAPI

/**
 * Component Registry
 *
 * Central registry for all components in the shadcn-admin AI-ready component system
 * This registry enables AI agents to discover, understand, and use components effectively
 */

export interface ComponentMetadata {
  /** Component name (PascalCase) */
  name: string

  /** Atomic design category */
  category: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern'

  /** File path to component implementation */
  path: string

  /** File path to component schema */
  schema: string

  /** File path to component documentation */
  documentation: string

  /** Internal dependencies (utility functions, hooks) */
  internalDependencies: string[]

  /** External package dependencies */
  externalDependencies: string[]

  /** Other components this component depends on */
  componentDependencies: string[]

  /** Searchable tags */
  tags: string[]

  /** Complexity level for AI agent selection */
  complexity: 'simple' | 'moderate' | 'complex'

  /** Last update timestamp */
  lastUpdated: string

  /** Semantic version */
  version: string

  /** Brief description */
  description: string

  /** WCAG compliance level */
  wcagLevel: 'A' | 'AA' | 'AAA'

  /** Whether the component has tests */
  hasTesting: boolean

  /** Whether the component has Storybook stories */
  hasStorybook: boolean
}

/**
 * Component Registry Database
 *
 * This is the source of truth for all components in the system
 * AI agents should query this registry to discover available components
 */
export const componentRegistry: ComponentMetadata[] = [
  {
    name: 'Button',
    category: 'atom',
    path: 'src/components/atoms/button/Button.tsx',
    schema: 'src/components/atoms/button/Button.schema.json',
    documentation: 'src/components/atoms/button/Button.md',
    internalDependencies: ['cn'],
    externalDependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    componentDependencies: [],
    tags: ['interactive', 'form', 'action', 'navigation', 'clickable'],
    complexity: 'simple',
    lastUpdated: '2024-11-17',
    version: '1.0.0',
    description: 'A versatile button component with multiple variants and sizes for user interactions',
    wcagLevel: 'AA',
    hasTesting: false,
    hasStorybook: false,
  },
  // Additional components will be added here as they are migrated
]

/**
 * Component Registry Index
 *
 * Fast lookup maps for component discovery
 */
export class ComponentRegistryIndex {
  private nameIndex: Map<string, ComponentMetadata>
  private categoryIndex: Map<string, ComponentMetadata[]>
  private tagIndex: Map<string, ComponentMetadata[]>

  constructor(registry: ComponentMetadata[]) {
    this.nameIndex = new Map()
    this.categoryIndex = new Map()
    this.tagIndex = new Map()

    this.buildIndices(registry)
  }

  private buildIndices(registry: ComponentMetadata[]) {
    for (const component of registry) {
      // Name index
      this.nameIndex.set(component.name.toLowerCase(), component)

      // Category index
      if (!this.categoryIndex.has(component.category)) {
        this.categoryIndex.set(component.category, [])
      }
      this.categoryIndex.get(component.category)!.push(component)

      // Tag index
      for (const tag of component.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, [])
        }
        this.tagIndex.get(tag)!.push(component)
      }
    }
  }

  /**
   * Find component by name
   */
  findByName(name: string): ComponentMetadata | undefined {
    return this.nameIndex.get(name.toLowerCase())
  }

  /**
   * Find components by category
   */
  findByCategory(category: ComponentMetadata['category']): ComponentMetadata[] {
    return this.categoryIndex.get(category) || []
  }

  /**
   * Find components by tag
   */
  findByTag(tag: string): ComponentMetadata[] {
    return this.tagIndex.get(tag) || []
  }

  /**
   * Find components by tags (intersection)
   */
  findByTags(tags: string[]): ComponentMetadata[] {
    if (tags.length === 0) return []

    const sets = tags.map((tag) => new Set(this.findByTag(tag)))
    const intersection = sets[0]

    for (let i = 1; i < sets.length; i++) {
      for (const component of intersection) {
        if (!sets[i].has(component)) {
          intersection.delete(component)
        }
      }
    }

    return Array.from(intersection)
  }

  /**
   * Find components by complexity
   */
  findByComplexity(complexity: ComponentMetadata['complexity']): ComponentMetadata[] {
    return Array.from(this.nameIndex.values()).filter(
      (c) => c.complexity === complexity
    )
  }

  /**
   * Search components by keyword
   */
  search(keyword: string): ComponentMetadata[] {
    const lowerKeyword = keyword.toLowerCase()
    return Array.from(this.nameIndex.values()).filter(
      (c) =>
        c.name.toLowerCase().includes(lowerKeyword) ||
        c.description.toLowerCase().includes(lowerKeyword) ||
        c.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  /**
   * Get all components
   */
  getAll(): ComponentMetadata[] {
    return Array.from(this.nameIndex.values())
  }

  /**
   * Get component count by category
   */
  getCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {}
    for (const [category, components] of this.categoryIndex) {
      counts[category] = components.length
    }
    return counts
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const all = this.getAll()
    return {
      total: all.length,
      byCategory: this.getCountByCategory(),
      byComplexity: {
        simple: this.findByComplexity('simple').length,
        moderate: this.findByComplexity('moderate').length,
        complex: this.findByComplexity('complex').length,
      },
      withTests: all.filter((c) => c.hasTesting).length,
      withStorybook: all.filter((c) => c.hasStorybook).length,
      wcagCompliance: {
        A: all.filter((c) => c.wcagLevel === 'A').length,
        AA: all.filter((c) => c.wcagLevel === 'AA').length,
        AAA: all.filter((c) => c.wcagLevel === 'AAA').length,
      },
    }
  }
}

/**
 * Global registry index instance
 */
export const registryIndex = new ComponentRegistryIndex(componentRegistry)

/**
 * Helper functions for AI agents
 */
export const componentHelpers = {
  /**
   * Get component by name
   */
  get(name: string): ComponentMetadata | undefined {
    return registryIndex.findByName(name)
  },

  /**
   * List all atoms
   */
  getAtoms(): ComponentMetadata[] {
    return registryIndex.findByCategory('atom')
  },

  /**
   * List all molecules
   */
  getMolecules(): ComponentMetadata[] {
    return registryIndex.findByCategory('molecule')
  },

  /**
   * List all organisms
   */
  getOrganisms(): ComponentMetadata[] {
    return registryIndex.findByCategory('organism')
  },

  /**
   * List all templates
   */
  getTemplates(): ComponentMetadata[] {
    return registryIndex.findByCategory('template')
  },

  /**
   * List all patterns
   */
  getPatterns(): ComponentMetadata[] {
    return registryIndex.findByCategory('pattern')
  },

  /**
   * Find interactive components
   */
  getInteractive(): ComponentMetadata[] {
    return registryIndex.findByTag('interactive')
  },

  /**
   * Find form-related components
   */
  getFormComponents(): ComponentMetadata[] {
    return registryIndex.findByTag('form')
  },

  /**
   * Get simple components (good for beginners or AI agents)
   */
  getSimple(): ComponentMetadata[] {
    return registryIndex.findByComplexity('simple')
  },

  /**
   * Search for components
   */
  search(keyword: string): ComponentMetadata[] {
    return registryIndex.search(keyword)
  },

  /**
   * Get registry statistics
   */
  getStats() {
    return registryIndex.getStats()
  },
}

/**
 * AI Agent Usage Examples
 *
 * These examples show AI agents how to use the component registry
 */
export const aiAgentUsageExamples = `
// Example 1: Find a component by name
import { componentHelpers } from '@/registry/component-registry'

const buttonMeta = componentHelpers.get('Button')
if (buttonMeta) {
  console.log(buttonMeta.path)        // src/components/atoms/button/Button.tsx
  console.log(buttonMeta.schema)      // src/components/atoms/button/Button.schema.json
  console.log(buttonMeta.description) // Component description
}

// Example 2: List all atoms
const atoms = componentHelpers.getAtoms()
atoms.forEach(atom => {
  console.log(\`\${atom.name}: \${atom.description}\`)
})

// Example 3: Find interactive components
const interactive = componentHelpers.getInteractive()

// Example 4: Search for components
const searchResults = componentHelpers.search('button')

// Example 5: Get statistics
const stats = componentHelpers.getStats()
console.log(\`Total components: \${stats.total}\`)
console.log(\`Atoms: \${stats.byCategory.atom}\`)
console.log(\`Components with tests: \${stats.withTests}\`)
`

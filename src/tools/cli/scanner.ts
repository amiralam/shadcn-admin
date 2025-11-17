#!/usr/bin/env node

/**
 * Component Scanner
 *
 * Automatically scans the codebase and generates component registry entries
 * for all existing components, even those not yet fully documented.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../..')

interface ScannedComponent {
  name: string
  category: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern'
  path: string
  schema: string | null
  documentation: string | null
  hasTests: boolean
  hasStorybook: boolean
  migrationStatus: 'documented' | 'pending' | 'integrated'
  externalDependencies: string[]
  tags: string[]
  description: string
}

// Component categorization rules
const componentCategories = {
  // Atoms - basic building blocks
  atoms: [
    'button', 'input', 'label', 'badge', 'checkbox', 'switch',
    'radio-group', 'textarea', 'separator', 'skeleton', 'avatar',
    'input-otp', 'alert', 'sonner', 'scroll-area', 'collapsible'
  ],
  // Molecules - simple combinations
  molecules: [
    'card', 'tooltip', 'popover', 'select', 'dropdown-menu',
    'tabs', 'form', 'calendar', 'command', 'sheet',
    'select-dropdown', 'confirm-dialog', 'password-input',
    'date-picker', 'search', 'profile-dropdown', 'theme-switch',
    'sign-out-dialog', 'alert-dialog'
  ],
  // Organisms - complex sections
  organisms: [
    'data-table', 'command-menu', 'coming-soon', 'navigation-progress',
    'table', 'sidebar', 'config-drawer', 'skip-to-main', 'learn-more',
    'long-text'
  ],
  // Layout components
  layout: [
    'authenticated-layout', 'header', 'app-sidebar', 'nav-group',
    'nav-user', 'team-switcher', 'top-nav', 'main', 'app-title'
  ]
}

function categorizeComponent(fileName: string): 'atom' | 'molecule' | 'organism' | 'template' | 'pattern' {
  const baseName = fileName.replace('.tsx', '').replace('.ts', '')

  if (componentCategories.atoms.includes(baseName)) return 'atom'
  if (componentCategories.molecules.includes(baseName)) return 'molecule'
  if (componentCategories.organisms.includes(baseName)) return 'organism'
  if (componentCategories.layout.includes(baseName)) return 'organism'

  // Default: molecules for unknown components
  return 'molecule'
}

function extractDependencies(content: string): string[] {
  const deps: string[] = []
  const importRegex = /from ['"](@radix-ui\/[^'"]+|class-variance-authority|lucide-react|cmdk|sonner|recharts)['"]/g
  let match

  while ((match = importRegex.exec(content)) !== null) {
    if (!deps.includes(match[1])) {
      deps.push(match[1])
    }
  }

  return deps.sort()
}

function generateTags(componentName: string, category: string, content: string): string[] {
  const tags: string[] = [category]
  const name = componentName.toLowerCase()

  // Interactive elements
  if (['button', 'input', 'checkbox', 'switch', 'select', 'radio-group'].includes(name)) {
    tags.push('interactive', 'form')
  }

  // Form-related
  if (['input', 'label', 'checkbox', 'form', 'textarea', 'select', 'radio-group'].includes(name)) {
    tags.push('form')
  }

  // Layout
  if (category === 'organism' && (name.includes('layout') || name.includes('sidebar') || name.includes('header'))) {
    tags.push('layout')
  }

  // Data display
  if (['table', 'card', 'badge', 'skeleton', 'alert'].includes(name)) {
    tags.push('display')
  }

  // Navigation
  if (name.includes('nav') || name === 'sidebar' || name === 'command-menu') {
    tags.push('navigation')
  }

  // Overlay
  if (['dialog', 'popover', 'tooltip', 'sheet', 'dropdown-menu', 'alert-dialog'].includes(name)) {
    tags.push('overlay')
  }

  return [...new Set(tags)]
}

function generateDescription(componentName: string, category: string): string {
  const descriptions: Record<string, string> = {
    'button': 'A versatile button component with multiple variants and sizes for user interactions',
    'input': 'Text input field for user data entry',
    'label': 'Form label for associating text with form controls',
    'badge': 'Small status indicator or label',
    'checkbox': 'Checkbox input for boolean selections',
    'switch': 'Toggle switch for on/off states',
    'radio-group': 'Radio button group for single selection',
    'textarea': 'Multi-line text input field',
    'separator': 'Visual divider for content sections',
    'skeleton': 'Loading placeholder for content',
    'avatar': 'User profile picture or placeholder',
    'card': 'Container component for grouping related content',
    'tooltip': 'Contextual information overlay on hover',
    'popover': 'Floating content container',
    'select': 'Dropdown selection component',
    'dropdown-menu': 'Menu with actionable items',
    'dialog': 'Modal dialog for focused interactions',
    'tabs': 'Tabbed interface for content organization',
    'form': 'Form wrapper with validation support',
    'table': 'Data table for structured information',
    'sidebar': 'Side navigation panel',
  }

  return descriptions[componentName.toLowerCase()] || `${componentName} component`
}

async function scanComponents(): Promise<ScannedComponent[]> {
  const components: ScannedComponent[] = []

  // Scan UI components
  const uiDir = path.join(rootDir, 'src/components/ui')
  const uiFiles = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'))

  for (const file of uiFiles) {
    const filePath = path.join(uiDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const componentName = file.replace('.tsx', '').split('-').map(w =>
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join('')

    const category = categorizeComponent(file)
    const deps = extractDependencies(content)
    const tags = generateTags(file.replace('.tsx', ''), category, content)

    // Check if migrated version exists
    const atomPath = path.join(rootDir, `src/components/atoms/${file.replace('.tsx', '')}`)
    const hasMigrated = fs.existsSync(atomPath)
    const schemaPath = hasMigrated ? `src/components/atoms/${file.replace('.tsx', '')}/${componentName}.schema.json` : null
    const docPath = hasMigrated ? `src/components/atoms/${file.replace('.tsx', '')}/${componentName}.md` : null

    components.push({
      name: componentName,
      category,
      path: `src/components/ui/${file}`,
      schema: schemaPath,
      documentation: docPath,
      hasTests: false,
      hasStorybook: false,
      migrationStatus: hasMigrated ? 'documented' : 'pending',
      externalDependencies: deps,
      tags,
      description: generateDescription(file.replace('.tsx', ''), category),
    })
  }

  // Scan other component directories
  const otherComponents = [
    { dir: 'src/components/layout', category: 'organism' as const },
    { dir: 'src/components/data-table', category: 'organism' as const },
    { dir: 'src/components', category: 'molecule' as const },
  ]

  for (const { dir, category } of otherComponents) {
    const fullPath = path.join(rootDir, dir)
    if (!fs.existsSync(fullPath)) continue

    const files = fs.readdirSync(fullPath)
      .filter(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'))

    for (const file of files) {
      const filePath = path.join(fullPath, file)
      const stat = fs.statSync(filePath)
      if (!stat.isFile()) continue

      const content = fs.readFileSync(filePath, 'utf-8')
      const componentName = file.replace('.tsx', '').split('-').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join('')

      const deps = extractDependencies(content)
      const finalCategory = categorizeComponent(file)
      const tags = generateTags(file.replace('.tsx', ''), finalCategory, content)

      components.push({
        name: componentName,
        category: finalCategory,
        path: `${dir}/${file}`,
        schema: null,
        documentation: null,
        hasTests: false,
        hasStorybook: false,
        migrationStatus: 'pending',
        externalDependencies: deps,
        tags,
        description: generateDescription(file.replace('.tsx', ''), finalCategory),
      })
    }
  }

  return components
}

async function main() {
  console.log('🔍 Scanning components...\n')

  const components = await scanComponents()

  console.log(`Found ${components.length} components:\n`)

  // Group by category
  const byCategory = components.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {} as Record<string, ScannedComponent[]>)

  for (const [category, comps] of Object.entries(byCategory)) {
    console.log(`${category.toUpperCase()}: ${comps.length}`)
    comps.forEach(c => {
      const status = c.migrationStatus === 'documented' ? '✅' : '⏳'
      console.log(`  ${status} ${c.name}`)
    })
    console.log()
  }

  // Generate registry files
  const registryTsPath = path.join(rootDir, 'src/registry/component-registry-full.ts')
  const registryJsonPath = path.join(rootDir, 'src/registry/component-registry-full.json')

  // Generate TypeScript registry
  const tsContent = generateTypeScriptRegistry(components)
  fs.writeFileSync(registryTsPath, tsContent, 'utf-8')

  // Generate JSON registry
  const jsonContent = JSON.stringify({
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalComponents: components.length,
    components: components.map(c => ({
      name: c.name,
      category: c.category,
      path: c.path,
      schema: c.schema,
      documentation: c.documentation,
      internalDependencies: ['cn'],
      externalDependencies: c.externalDependencies,
      componentDependencies: [],
      tags: c.tags,
      complexity: 'simple',
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      description: c.description,
      wcagLevel: 'AA',
      hasTesting: c.hasTests,
      hasStorybook: c.hasStorybook,
      migrationStatus: c.migrationStatus,
    }))
  }, null, 2)

  fs.writeFileSync(registryJsonPath, jsonContent, 'utf-8')

  console.log(`✅ Generated registry files:`)
  console.log(`   - ${registryTsPath}`)
  console.log(`   - ${registryJsonPath}`)
  console.log(`\n📊 Summary:`)
  console.log(`   Total: ${components.length} components`)
  console.log(`   Documented: ${components.filter(c => c.migrationStatus === 'documented').length}`)
  console.log(`   Pending: ${components.filter(c => c.migrationStatus === 'pending').length}`)
}

function generateTypeScriptRegistry(components: ScannedComponent[]): string {
  return `/**
 * Full Component Registry
 *
 * Auto-generated by component scanner
 * Contains ALL components in the codebase, including undocumented ones
 *
 * Last updated: ${new Date().toISOString().split('T')[0]}
 */

import { ComponentMetadata } from './component-registry'

export const fullComponentRegistry: ComponentMetadata[] = ${JSON.stringify(
  components.map(c => ({
    name: c.name,
    category: c.category,
    path: c.path,
    schema: c.schema || 'pending',
    documentation: c.documentation || 'pending',
    internalDependencies: ['cn'],
    externalDependencies: c.externalDependencies,
    componentDependencies: [],
    tags: c.tags,
    complexity: 'simple' as const,
    lastUpdated: new Date().toISOString().split('T')[0],
    version: '1.0.0',
    description: c.description,
    wcagLevel: 'AA' as const,
    hasTesting: c.hasTests,
    hasStorybook: c.hasStorybook,
  })),
  null,
  2
)}

/**
 * Registry statistics
 */
export const registryStats = {
  total: ${components.length},
  byCategory: {
    atoms: ${components.filter(c => c.category === 'atom').length},
    molecules: ${components.filter(c => c.category === 'molecule').length},
    organisms: ${components.filter(c => c.category === 'organism').length},
    templates: ${components.filter(c => c.category === 'template').length},
    patterns: ${components.filter(c => c.category === 'pattern').length},
  },
  documented: ${components.filter(c => c.migrationStatus === 'documented').length},
  pending: ${components.filter(c => c.migrationStatus === 'pending').length},
}
`
}

main().catch(console.error)

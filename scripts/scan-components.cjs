#!/usr/bin/env node

/**
 * Component Scanner
 * Scans all components and generates comprehensive registry
 */

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

// Component categorization
const componentCategories = {
  atoms: [
    'button', 'input', 'label', 'badge', 'checkbox', 'switch',
    'radio-group', 'textarea', 'separator', 'skeleton', 'avatar',
    'input-otp', 'alert', 'sonner', 'scroll-area', 'collapsible'
  ],
  molecules: [
    'card', 'tooltip', 'popover', 'select', 'dropdown-menu',
    'tabs', 'form', 'calendar', 'command', 'sheet',
    'select-dropdown', 'confirm-dialog', 'password-input',
    'date-picker', 'search', 'profile-dropdown', 'theme-switch',
    'sign-out-dialog', 'alert-dialog', 'config-drawer'
  ],
  organisms: [
    'data-table', 'command-menu', 'coming-soon', 'navigation-progress',
    'table', 'sidebar', 'skip-to-main', 'learn-more', 'long-text'
  ],
}

function categorizeComponent(fileName) {
  const baseName = fileName.replace('.tsx', '').replace('.ts', '')

  if (componentCategories.atoms.includes(baseName)) return 'atom'
  if (componentCategories.molecules.includes(baseName)) return 'molecule'
  if (componentCategories.organisms.includes(baseName)) return 'organism'

  return 'molecule'
}

function extractDependencies(content) {
  const deps = []
  const importRegex = /from ['"](@radix-ui\/[^'"]+|class-variance-authority|lucide-react|cmdk|sonner|recharts|react-hook-form|zod|@hookform\/resolvers|date-fns|react-day-picker)['"]/g
  let match

  while ((match = importRegex.exec(content)) !== null) {
    if (!deps.includes(match[1])) {
      deps.push(match[1])
    }
  }

  return deps.sort()
}

function generateTags(componentName, category) {
  const tags = [category]
  const name = componentName.toLowerCase()

  if (['button', 'input', 'checkbox', 'switch', 'select', 'radiogroup'].includes(name)) {
    tags.push('interactive', 'form')
  }

  if (['input', 'label', 'checkbox', 'form', 'textarea', 'select', 'radiogroup', 'passwordinput'].includes(name)) {
    tags.push('form')
  }

  if (name.includes('layout') || name.includes('sidebar') || name.includes('header') || name.includes('nav')) {
    tags.push('layout')
  }

  if (['table', 'card', 'badge', 'skeleton', 'alert'].includes(name)) {
    tags.push('display')
  }

  if (name.includes('nav') || name === 'sidebar' || name === 'commandmenu') {
    tags.push('navigation')
  }

  if (['dialog', 'popover', 'tooltip', 'sheet', 'dropdownmenu', 'alertdialog'].includes(name)) {
    tags.push('overlay')
  }

  return [...new Set(tags)]
}

const descriptions = {
  'alert': 'Alert banner for displaying important messages',
  'alertdialog': 'Modal dialog for confirmations and important decisions',
  'avatar': 'User profile picture or placeholder image',
  'badge': 'Small status indicator or label for categorization',
  'button': 'Interactive button with multiple variants and sizes',
  'calendar': 'Date picker calendar component',
  'card': 'Container for grouping related content',
  'checkbox': 'Checkbox input for boolean selections',
  'collapsible': 'Collapsible container for hiding/showing content',
  'command': 'Command palette for keyboard-driven navigation',
  'dialog': 'Modal dialog for focused interactions',
  'dropdownmenu': 'Dropdown menu with actionable items',
  'form': 'Form wrapper with validation support',
  'input': 'Text input field for user data entry',
  'inputotp': 'One-time password input field',
  'label': 'Form label for associating text with controls',
  'popover': 'Floating content container',
  'radiogroup': 'Radio button group for single selection',
  'scrollarea': 'Custom scrollable area with styled scrollbar',
  'select': 'Dropdown selection component',
  'separator': 'Visual divider for content sections',
  'sheet': 'Slide-out panel for additional content',
  'sidebar': 'Side navigation panel',
  'skeleton': 'Loading placeholder animation',
  'sonner': 'Toast notification component',
  'switch': 'Toggle switch for on/off states',
  'table': 'Data table for structured information',
  'tabs': 'Tabbed interface for content organization',
  'textarea': 'Multi-line text input field',
  'tooltip': 'Contextual information overlay on hover',
  'datepicker': 'Date selection component',
  'passwordinput': 'Password input with show/hide toggle',
  'search': 'Search input component',
  'commandmenu': 'Global command menu for quick actions',
  'confirmdialog': 'Confirmation dialog component',
  'datatable': 'Advanced data table with sorting and filtering',
  'profiledropdown': 'User profile dropdown menu',
  'selectdropdown': 'Custom select dropdown',
  'themeswitch': 'Theme toggle component',
  'navigationprogress': 'Navigation progress indicator',
  'comingsoon': 'Coming soon placeholder component',
  'configdrawer': 'Configuration drawer panel',
  'learnmore': 'Learn more link component',
  'longtext': 'Long text display component',
  'signoutdialog': 'Sign out confirmation dialog',
  'skiptomain': 'Skip to main content link for accessibility',
}

function getDescription(componentName) {
  const name = componentName.toLowerCase().replace(/\s/g, '')
  return descriptions[name] || `${componentName} component`
}

function scanComponents() {
  const components = []

  // Scan UI components
  const uiDir = path.join(rootDir, 'src/components/ui')
  if (fs.existsSync(uiDir)) {
    const uiFiles = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'))

    for (const file of uiFiles) {
      const filePath = path.join(uiDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const baseName = file.replace('.tsx', '')
      const componentName = baseName.split('-').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join('')

      const category = categorizeComponent(file)
      const deps = extractDependencies(content)
      const tags = generateTags(componentName, category)

      // Check if migrated
      const atomPath = path.join(rootDir, `src/components/atoms/${baseName}`)
      const hasMigrated = fs.existsSync(atomPath)

      components.push({
        name: componentName,
        category,
        path: `src/components/ui/${file}`,
        schema: hasMigrated ? `src/components/atoms/${baseName}/${componentName}.schema.json` : null,
        documentation: hasMigrated ? `src/components/atoms/${baseName}/${componentName}.md` : null,
        internalDependencies: ['cn'],
        externalDependencies: deps,
        componentDependencies: [],
        tags,
        complexity: 'simple',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0.0',
        description: getDescription(componentName),
        wcagLevel: 'AA',
        hasTesting: false,
        hasStorybook: false,
        migrationStatus: hasMigrated ? 'documented' : 'pending',
      })
    }
  }

  // Scan layout components
  const layoutDir = path.join(rootDir, 'src/components/layout')
  if (fs.existsSync(layoutDir)) {
    const layoutFiles = fs.readdirSync(layoutDir).filter(f => f.endsWith('.tsx'))

    for (const file of layoutFiles) {
      const filePath = path.join(layoutDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const baseName = file.replace('.tsx', '')
      const componentName = baseName.split('-').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join('')

      const deps = extractDependencies(content)

      components.push({
        name: componentName,
        category: 'organism',
        path: `src/components/layout/${file}`,
        schema: null,
        documentation: null,
        internalDependencies: ['cn'],
        externalDependencies: deps,
        componentDependencies: [],
        tags: ['organism', 'layout'],
        complexity: 'moderate',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0.0',
        description: `${componentName} layout component`,
        wcagLevel: 'AA',
        hasTesting: false,
        hasStorybook: false,
        migrationStatus: 'pending',
      })
    }
  }

  // Scan data-table components
  const dataTableDir = path.join(rootDir, 'src/components/data-table')
  if (fs.existsSync(dataTableDir)) {
    const dtFiles = fs.readdirSync(dataTableDir).filter(f => f.endsWith('.tsx'))

    for (const file of dtFiles) {
      const filePath = path.join(dataTableDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const baseName = file.replace('.tsx', '')
      const componentName = baseName.split('-').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join('')

      const deps = extractDependencies(content)

      components.push({
        name: `DataTable${componentName}`,
        category: 'organism',
        path: `src/components/data-table/${file}`,
        schema: null,
        documentation: null,
        internalDependencies: ['cn'],
        externalDependencies: deps,
        componentDependencies: [],
        tags: ['organism', 'data', 'table'],
        complexity: 'complex',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0.0',
        description: `Data table ${componentName.toLowerCase()} component`,
        wcagLevel: 'AA',
        hasTesting: false,
        hasStorybook: false,
        migrationStatus: 'pending',
      })
    }
  }

  // Scan root components
  const rootComponents = [
    'coming-soon.tsx', 'command-menu.tsx', 'config-drawer.tsx',
    'confirm-dialog.tsx', 'date-picker.tsx', 'learn-more.tsx',
    'long-text.tsx', 'navigation-progress.tsx', 'password-input.tsx',
    'profile-dropdown.tsx', 'search.tsx', 'select-dropdown.tsx',
    'sign-out-dialog.tsx', 'skip-to-main.tsx', 'theme-switch.tsx'
  ]

  const rootDir2 = path.join(rootDir, 'src/components')
  for (const file of rootComponents) {
    const filePath = path.join(rootDir2, file)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf-8')
    const baseName = file.replace('.tsx', '')
    const componentName = baseName.split('-').map(w =>
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join('')

    const category = categorizeComponent(file)
    const deps = extractDependencies(content)
    const tags = generateTags(componentName, category)

    components.push({
      name: componentName,
      category,
      path: `src/components/${file}`,
      schema: null,
      documentation: null,
      internalDependencies: ['cn'],
      externalDependencies: deps,
      componentDependencies: [],
      tags,
      complexity: category === 'organism' ? 'complex' : 'moderate',
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      description: getDescription(componentName),
      wcagLevel: 'AA',
      hasTesting: false,
      hasStorybook: false,
      migrationStatus: 'pending',
    })
  }

  return components
}

function main() {
  console.log('🔍 Scanning components...\n')

  const components = scanComponents()

  console.log(`Found ${components.length} components:\n`)

  // Group by category
  const byCategory = {}
  components.forEach(c => {
    if (!byCategory[c.category]) byCategory[c.category] = []
    byCategory[c.category].push(c)
  })

  for (const [category, comps] of Object.entries(byCategory)) {
    console.log(`${category.toUpperCase()}: ${comps.length}`)
    comps.forEach(c => {
      const status = c.migrationStatus === 'documented' ? '✅' : '⏳'
      console.log(`  ${status} ${c.name}`)
    })
    console.log()
  }

  // Write JSON registry
  const jsonPath = path.join(rootDir, 'src/registry/component-registry-full.json')
  const jsonData = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalComponents: components.length,
    components
  }
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8')

  console.log(`✅ Generated: ${jsonPath}`)
  console.log(`\n📊 Summary:`)
  console.log(`   Total: ${components.length} components`)
  console.log(`   Atoms: ${components.filter(c => c.category === 'atom').length}`)
  console.log(`   Molecules: ${components.filter(c => c.category === 'molecule').length}`)
  console.log(`   Organisms: ${components.filter(c => c.category === 'organism').length}`)
  console.log(`   Documented: ${components.filter(c => c.migrationStatus === 'documented').length}`)
  console.log(`   Pending: ${components.filter(c => c.migrationStatus === 'pending').length}`)
}

main()

/**
 * Test script for MCP tools
 *
 * Run with: npx tsx src/mcp/test-tools.ts
 */

import {
  discoverComponents,
  searchComponents,
  getComponent,
  getRegistryStats,
  listAtoms,
  listMolecules,
  listOrganisms
} from './tools/discovery'

import {
  loadSchema,
  loadDocumentation,
  generateImport,
  generateUsage,
  getComponentExamples
} from './tools/generation'

async function runPhase1Tests() {
  console.log('Testing MCP Phase 1 Tools\n')
  console.log('='.repeat(50))

  // Test 1: Get registry stats
  console.log('\n1. Testing get_registry_stats:')
  const stats = getRegistryStats()
  console.log(`   Total components: ${stats.total}`)
  console.log(`   Documented: ${stats.documented}`)
  console.log(`   By category:`, stats.byCategory)

  // Test 2: Discover components with filters
  console.log('\n2. Testing discover_components (form atoms):')
  const formAtoms = await discoverComponents({
    category: 'atom',
    tags: ['form'],
    limit: 5
  })
  console.log(`   Found ${formAtoms.count} of ${formAtoms.totalMatches} matches`)
  formAtoms.components.forEach((c) => {
    console.log(`   - ${c.name}: ${c.description}`)
  })

  // Test 3: Search components
  console.log('\n3. Testing search_components (query: "button"):')
  const buttonSearch = await searchComponents({ query: 'button', limit: 5 })
  console.log(`   Found ${buttonSearch.count} results`)
  buttonSearch.results.forEach((r) => {
    console.log(`   - ${r.name} (${r.relevance}): ${r.description}`)
  })

  // Test 4: Get specific component
  console.log('\n4. Testing get_component (Button):')
  const button = getComponent({ name: 'Button' })
  if ('error' in button) {
    console.log(`   Error: ${button.message}`)
  } else {
    console.log(`   Name: ${button.name}`)
    console.log(`   Category: ${button.category}`)
    console.log(`   Path: ${button.path}`)
    console.log(`   Has Schema: ${!!button.schema}`)
    console.log(`   Tags: ${button.tags.join(', ')}`)
  }

  // Test 5: Get non-existent component
  console.log('\n5. Testing get_component (NonExistent):')
  const nonExistent = getComponent({ name: 'NonExistent' })
  if ('error' in nonExistent) {
    console.log(`   Error: ${nonExistent.error}`)
    console.log(`   Message: ${nonExistent.message}`)
    console.log(`   Suggestions: ${nonExistent.suggestions.join(', ') || 'none'}`)
  }

  // Test 6: List atoms
  console.log('\n6. Testing list_atoms:')
  const atoms = listAtoms({ limit: 5 })
  console.log(`   Showing ${atoms.count} of ${atoms.total} atoms`)
  atoms.components.forEach((c) => {
    console.log(`   - ${c.name}`)
  })

  // Test 7: List molecules
  console.log('\n7. Testing list_molecules:')
  const molecules = listMolecules({ limit: 5 })
  console.log(`   Showing ${molecules.count} of ${molecules.total} molecules`)
  molecules.components.forEach((c) => {
    console.log(`   - ${c.name}`)
  })

  // Test 8: List organisms
  console.log('\n8. Testing list_organisms:')
  const organisms = listOrganisms({ limit: 5 })
  console.log(`   Showing ${organisms.count} of ${organisms.total} organisms`)
  organisms.components.forEach((c) => {
    console.log(`   - ${c.name}`)
  })

  // Test 9: Discover documented components
  console.log('\n9. Testing discover_components (documented only):')
  const documented = await discoverComponents({
    hasDocumentation: true,
    hasSchema: true,
    limit: 10
  })
  console.log(`   Found ${documented.count} documented components with schemas`)
  documented.components.forEach((c) => {
    console.log(`   - ${c.name} (${c.category})`)
  })
}

async function runPhase2Tests() {
  console.log('\n\nTesting MCP Phase 2 Tools\n')
  console.log('='.repeat(50))

  // Test 10: Load schema
  console.log('\n10. Testing load_schema (Button):')
  const schemaResult = await loadSchema({ name: 'Button' })
  if ('error' in schemaResult) {
    console.log(`   Error: ${schemaResult.message}`)
  } else {
    console.log(`   Component: ${schemaResult.componentName}`)
    console.log(`   Category: ${schemaResult.category}`)
    console.log(`   Has props: ${!!schemaResult.schema.props}`)
    if (schemaResult.schema.props) {
      const propNames = Object.keys(schemaResult.schema.props)
      console.log(`   Props: ${propNames.join(', ')}`)
    }
  }

  // Test 11: Load schema for non-documented component
  console.log('\n11. Testing load_schema (Input - no schema):')
  const noSchemaResult = await loadSchema({ name: 'Input' })
  if ('error' in noSchemaResult) {
    console.log(`   Error: ${noSchemaResult.error}`)
    console.log(`   Message: ${noSchemaResult.message}`)
  }

  // Test 12: Load documentation
  console.log('\n12. Testing load_documentation (Button):')
  const docResult = await loadDocumentation({ name: 'Button' })
  if ('error' in docResult) {
    console.log(`   Error: ${docResult.message}`)
  } else {
    console.log(`   Component: ${docResult.componentName}`)
    console.log(`   Path: ${docResult.path}`)
    console.log(`   Content length: ${docResult.documentation.length} chars`)
    console.log(`   Preview: ${docResult.documentation.substring(0, 100)}...`)
  }

  // Test 13: Generate import
  console.log('\n13. Testing generate_import (Button):')
  const importResult = generateImport({ name: 'Button' })
  if ('error' in importResult) {
    console.log(`   Error: ${importResult.message}`)
  } else {
    console.log(`   Import: ${importResult.import}`)
    console.log(`   Path: ${importResult.path}`)
  }

  // Test 14: Generate import with types
  console.log('\n14. Testing generate_import with types (Button):')
  const typedImportResult = generateImport({ name: 'Button', includeTypes: true })
  if ('error' in typedImportResult) {
    console.log(`   Error: ${typedImportResult.message}`)
  } else {
    console.log(`   Import: ${typedImportResult.import}`)
    console.log(`   Type Import: ${typedImportResult.typeImport}`)
  }

  // Test 15: Generate usage
  console.log('\n15. Testing generate_usage (Button with props):')
  const usageResult = generateUsage({
    name: 'Button',
    props: { variant: 'destructive', size: 'lg' },
    children: 'Delete'
  })
  if ('error' in usageResult) {
    console.log(`   Error: ${usageResult.message}`)
  } else {
    console.log(`   Usage: ${usageResult.usage}`)
    console.log(`   Import: ${usageResult.import}`)
  }

  // Test 16: Generate usage with default props
  console.log('\n16. Testing generate_usage (Button default):')
  const defaultUsageResult = generateUsage({
    name: 'Button',
    children: 'Click me'
  })
  if ('error' in defaultUsageResult) {
    console.log(`   Error: ${defaultUsageResult.message}`)
  } else {
    console.log(`   Usage: ${defaultUsageResult.usage}`)
  }

  // Test 17: Get component examples
  console.log('\n17. Testing get_component_examples (Button):')
  const examplesResult = await getComponentExamples({ name: 'Button' })
  if ('error' in examplesResult) {
    console.log(`   Error: ${examplesResult.message}`)
  } else {
    console.log(`   Component: ${examplesResult.componentName}`)
    console.log(`   Examples: ${examplesResult.examples.length}`)
    console.log(`   Composition Patterns: ${examplesResult.compositionPatterns.length}`)
    if (examplesResult.examples.length > 0) {
      console.log(`   First example: ${examplesResult.examples[0].name}`)
    }
  }

  // Test 18: Get component examples with filter
  console.log('\n18. Testing get_component_examples with filter (Button, "form"):')
  const filteredExamples = await getComponentExamples({ name: 'Button', pattern: 'form' })
  if ('error' in filteredExamples) {
    console.log(`   Error: ${filteredExamples.message}`)
  } else {
    console.log(`   Filtered examples: ${filteredExamples.examples.length}`)
    console.log(`   Filtered patterns: ${filteredExamples.compositionPatterns.length}`)
  }
}

async function runTests() {
  await runPhase1Tests()
  await runPhase2Tests()

  console.log('\n' + '='.repeat(50))
  console.log('All tests completed successfully!')
}

runTests().catch(console.error)

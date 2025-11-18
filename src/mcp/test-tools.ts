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

async function runTests() {
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

  console.log('\n' + '='.repeat(50))
  console.log('All tests completed successfully!')
}

runTests().catch(console.error)

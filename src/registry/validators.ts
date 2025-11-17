/**
 * Component Validation Tools
 *
 * Validates component schemas, props, and generated code
 */

import type { ComponentMetadata } from './component-registry'

export interface PropValidationError {
  prop: string
  value: any
  error: string
  expected?: string[]
}

export interface PropValidationResult {
  valid: boolean
  errors: PropValidationError[]
  warnings: PropValidationError[]
}

export interface SchemaValidationError {
  path: string
  error: string
}

export interface SchemaValidationResult {
  valid: boolean
  errors: SchemaValidationError[]
}

/**
 * Validate props against a component schema
 */
export function validatePropsAgainstSchema(
  schema: any,
  props: Record<string, any>
): PropValidationResult {
  const errors: PropValidationError[] = []
  const warnings: PropValidationError[] = []

  if (!schema || !schema.props) {
    return { valid: true, errors, warnings }
  }

  const schemaPropDefinitions = schema.props

  // Check each provided prop
  for (const [propName, propValue] of Object.entries(props)) {
    const propDef = schemaPropDefinitions[propName]

    if (!propDef) {
      warnings.push({
        prop: propName,
        value: propValue,
        error: 'Prop not defined in schema (may be a valid HTML attribute)',
      })
      continue
    }

    // Validate enum values
    if (propDef.type === 'enum' && propDef.values) {
      if (!propDef.values.includes(propValue)) {
        errors.push({
          prop: propName,
          value: propValue,
          error: `Invalid value for prop "${propName}"`,
          expected: propDef.values,
        })
      }
    }

    // Validate boolean
    if (propDef.type === 'boolean' && typeof propValue !== 'boolean') {
      errors.push({
        prop: propName,
        value: propValue,
        error: `Prop "${propName}" must be a boolean`,
        expected: ['true', 'false'],
      })
    }

    // Validate number
    if (propDef.type === 'number' && typeof propValue !== 'number') {
      errors.push({
        prop: propName,
        value: propValue,
        error: `Prop "${propName}" must be a number`,
      })
    }

    // Validate string
    if (propDef.type === 'string' && typeof propValue !== 'string') {
      errors.push({
        prop: propName,
        value: propValue,
        error: `Prop "${propName}" must be a string`,
      })
    }
  }

  // Check for required props
  for (const [propName, propDef] of Object.entries(schemaPropDefinitions) as [string, any][]) {
    if (propDef.required && !(propName in props)) {
      errors.push({
        prop: propName,
        value: undefined,
        error: `Required prop "${propName}" is missing`,
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate component metadata against schema
 */
export function validateComponentMetadata(
  metadata: ComponentMetadata
): SchemaValidationResult {
  const errors: SchemaValidationError[] = []

  // Required fields
  if (!metadata.name) {
    errors.push({ path: 'name', error: 'Component name is required' })
  }

  if (!metadata.category) {
    errors.push({ path: 'category', error: 'Component category is required' })
  }

  if (!metadata.path) {
    errors.push({ path: 'path', error: 'Component path is required' })
  }

  if (!metadata.description) {
    errors.push({ path: 'description', error: 'Component description is required' })
  }

  // Validate category
  const validCategories = ['atom', 'molecule', 'organism', 'template', 'pattern']
  if (metadata.category && !validCategories.includes(metadata.category)) {
    errors.push({
      path: 'category',
      error: `Invalid category "${metadata.category}". Must be one of: ${validCategories.join(', ')}`
    })
  }

  // Validate complexity
  const validComplexities = ['simple', 'moderate', 'complex']
  if (metadata.complexity && !validComplexities.includes(metadata.complexity)) {
    errors.push({
      path: 'complexity',
      error: `Invalid complexity "${metadata.complexity}". Must be one of: ${validComplexities.join(', ')}`
    })
  }

  // Validate WCAG level
  const validWCAG = ['A', 'AA', 'AAA']
  if (metadata.wcagLevel && !validWCAG.includes(metadata.wcagLevel)) {
    errors.push({
      path: 'wcagLevel',
      error: `Invalid WCAG level "${metadata.wcagLevel}". Must be one of: ${validWCAG.join(', ')}`
    })
  }

  // Validate version format (semver)
  if (metadata.version && !/^\d+\.\d+\.\d+$/.test(metadata.version)) {
    errors.push({
      path: 'version',
      error: `Invalid version format "${metadata.version}". Must be semver (e.g., 1.0.0)`
    })
  }

  // Validate tags
  if (!metadata.tags || metadata.tags.length === 0) {
    errors.push({
      path: 'tags',
      error: 'Component must have at least one tag'
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate import statement
 */
export function validateImportStatement(
  importStatement: string,
  componentName: string,
  expectedPath: string
): { valid: boolean; error?: string } {
  // Check for correct component name
  if (!importStatement.includes(componentName)) {
    return {
      valid: false,
      error: `Import statement must include component name "${componentName}"`
    }
  }

  // Check for import keyword
  if (!importStatement.startsWith('import')) {
    return {
      valid: false,
      error: 'Statement must start with "import"'
    }
  }

  // Check for correct path format
  if (!importStatement.includes('@/') && !importStatement.includes('./')) {
    return {
      valid: false,
      error: 'Import path must use "@/" or relative "./" notation'
    }
  }

  return { valid: true }
}

/**
 * Validate JSX usage
 */
export function validateJSXUsage(
  jsx: string,
  componentName: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for component name
  if (!jsx.includes(`<${componentName}`)) {
    errors.push(`JSX must use component name "<${componentName}"`)
  }

  // Check for self-closing or closing tag
  if (!jsx.includes('/>') && !jsx.includes(`</${componentName}>`)) {
    errors.push('JSX must be properly closed')
  }

  // Check for balanced tags if not self-closing
  if (!jsx.includes('/>')) {
    const openCount = (jsx.match(new RegExp(`<${componentName}[^>]*>`, 'g')) || []).length
    const closeCount = (jsx.match(new RegExp(`</${componentName}>`, 'g')) || []).length

    if (openCount !== closeCount) {
      errors.push('Unbalanced JSX tags')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate design token usage
 */
export function validateDesignTokens(
  className: string
): { valid: boolean; hardCodedValues: string[]; warnings: string[] } {
  const hardCodedValues: string[] = []
  const warnings: string[] = []

  // Check for hard-coded colors
  const colorRegex = /(bg|text|border)-(\w+-\d+)/g
  let match
  while ((match = colorRegex.exec(className)) !== null) {
    if (match[2] !== 'inherit' && match[2] !== 'current' && match[2] !== 'transparent') {
      hardCodedValues.push(match[0])
      warnings.push(`Hard-coded color found: "${match[0]}". Use semantic tokens instead.`)
    }
  }

  // Check for hard-coded spacing (arbitrary values)
  const arbitraryRegex = /\[([^\]]+)\]/g
  while ((match = arbitraryRegex.exec(className)) !== null) {
    hardCodedValues.push(match[0])
    warnings.push(`Arbitrary value found: "${match[0]}". Use design tokens instead.`)
  }

  return {
    valid: hardCodedValues.length === 0,
    hardCodedValues,
    warnings
  }
}

/**
 * Comprehensive component validation
 */
export async function validateComponent(
  componentName: string,
  metadata: ComponentMetadata,
  schema?: any,
  exampleCode?: string
): Promise<{
  valid: boolean
  metadata: SchemaValidationResult
  schema?: SchemaValidationResult
  code?: { valid: boolean; errors: string[] }
}> {
  const metadataValidation = validateComponentMetadata(metadata)

  const result: any = {
    valid: true,
    metadata: metadataValidation,
  }

  if (!metadataValidation.valid) {
    result.valid = false
  }

  // Validate schema structure if provided
  if (schema) {
    const schemaErrors: SchemaValidationError[] = []

    if (!schema.componentName) {
      schemaErrors.push({ path: 'componentName', error: 'Schema must have componentName' })
    }

    if (!schema.props) {
      schemaErrors.push({ path: 'props', error: 'Schema must define props' })
    }

    if (!schema.accessibility) {
      schemaErrors.push({ path: 'accessibility', error: 'Schema must define accessibility' })
    }

    result.schema = {
      valid: schemaErrors.length === 0,
      errors: schemaErrors
    }

    if (!result.schema.valid) {
      result.valid = false
    }
  }

  // Validate example code if provided
  if (exampleCode) {
    const codeValidation = validateJSXUsage(exampleCode, componentName)
    result.code = codeValidation

    if (!codeValidation.valid) {
      result.valid = false
    }
  }

  return result
}

/**
 * Generate validation report
 */
export function generateValidationReport(
  components: ComponentMetadata[]
): {
  total: number
  valid: number
  invalid: number
  issues: Record<string, SchemaValidationError[]>
} {
  const issues: Record<string, SchemaValidationError[]> = {}
  let valid = 0
  let invalid = 0

  for (const component of components) {
    const result = validateComponentMetadata(component)

    if (result.valid) {
      valid++
    } else {
      invalid++
      issues[component.name] = result.errors
    }
  }

  return {
    total: components.length,
    valid,
    invalid,
    issues
  }
}

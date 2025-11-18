/**
 * Agent API Wrapper for MCP Server
 *
 * This module wraps the AgentAPI class and validators for use in MCP tools.
 */

import { AgentAPI } from '../../registry/agent-api'
import {
  validatePropsAgainstSchema,
  validateDesignTokens
} from '../../registry/validators'

// Create singleton instance
export const agentAPI = new AgentAPI()

// Re-export validators for use in tools
export { validatePropsAgainstSchema, validateDesignTokens }

// Re-export types
export type {
  ComponentFilters,
  ValidationResult,
  ValidationError,
  ComponentHealth,
  CodeGenerationOptions
} from '../../registry/agent-api'

export type { ComponentMetadata } from '../../registry/component-registry'

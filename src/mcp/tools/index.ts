/**
 * MCP Tools Index
 *
 * This module exports all available MCP tools for registration with the server.
 */

import { discoveryTools } from './discovery'

// Export all tools for registration
export const allTools = [...discoveryTools]

// Export tool handlers for direct use
export {
  discoverComponents,
  searchComponents,
  getComponent,
  getRegistryStats,
  listAtoms,
  listMolecules,
  listOrganisms
} from './discovery'

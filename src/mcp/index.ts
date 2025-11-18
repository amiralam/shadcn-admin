#!/usr/bin/env node
/**
 * MCP Server Entry Point
 *
 * This module initializes and starts the MCP server with stdio transport.
 *
 * Usage:
 *   npx tsx src/mcp/index.ts
 *
 * Or with MCP inspector:
 *   npx @anthropic-ai/mcp-inspector npx tsx src/mcp/index.ts
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer, SERVER_NAME, SERVER_VERSION } from './server'

async function main(): Promise<void> {
  // Create the MCP server
  const server = createServer()

  // Create stdio transport
  const transport = new StdioServerTransport()

  // Connect server to transport
  await server.connect(transport)

  // Log startup (to stderr so it doesn't interfere with stdio protocol)
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`)
  console.error('MCP server listening on stdio transport')
}

// Run the server
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

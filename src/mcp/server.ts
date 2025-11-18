/**
 * MCP Server Configuration
 *
 * This module configures and exports the MCP server instance.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { allTools } from './tools/index'

// Server metadata
const SERVER_NAME = 'shadcn-components'
const SERVER_VERSION = '1.0.0'

/**
 * Create and configure the MCP server
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION
  })

  // Register all tools
  registerTools(server)

  return server
}

/**
 * Register all tools with the server
 */
function registerTools(server: McpServer): void {
  for (const tool of allTools) {
    server.tool(tool.name, tool.description, tool.schema, async (args: Record<string, unknown>) => {
      try {
        const result = await tool.handler(args as never)
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: 'TOOL_ERROR',
                  message: errorMessage
                },
                null,
                2
              )
            }
          ],
          isError: true
        }
      }
    })
  }
}

export { SERVER_NAME, SERVER_VERSION }

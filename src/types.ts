import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "./pex-client.js";

export type ToolRegistrar = (server: McpServer, client: PexClient) => void;

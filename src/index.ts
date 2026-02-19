#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { PexClient } from "./pex-client.js";
import { registerAllTools } from "./tools/index.js";

const server = new McpServer({ name: "pex-api", version: "1.0.0" });
const client = new PexClient();

registerAllTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);

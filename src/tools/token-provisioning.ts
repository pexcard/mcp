import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_token_provisioning_mode",
    { description: "Get the business token provisioning mode" },
    async () => {
      try {
        const result = await client.get("/TokenProvisioning/Mode");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_provisioning_mode",
    {
      description: "Get token provisioning mode for a specific cardholder",
      inputSchema: {
        id: z.number().describe("Cardholder account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/TokenProvisioning/${id}/Mode`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_issued_tokens",
    {
      description: "Get issued tokens for a specific cardholder",
      inputSchema: {
        id: z.number().describe("Cardholder account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/TokenProvisioning/${id}/IssuesTokens`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

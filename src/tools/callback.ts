import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_callback_types",
    { description: "Get available callback subscription types" },
    async () => {
      try {
        const result = await client.get("/callback-subscription/types");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_list_callback_subscriptions",
    {
      description: "Get all callback subscriptions for the business, optionally filtered by type",
      inputSchema: {
        type: z
          .string()
          .optional()
          .describe(
            "Callback type filter. Valid values: Card, Cardorder, CardOrderVirtual, CardTokenCreated, AuthRealtime, PinRealtime, DeclineRealtime, ReversalRealtime, SettlementPostedRealtime"
          ),
      },
    },
    async ({ type }) => {
      try {
        const result = await client.get("/callback-subscription", { type });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_callback_subscription",
    {
      description: "Get a specific callback subscription by ID",
      inputSchema: {
        id: z.number().describe("Subscription ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/callback-subscription/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_card",
    {
      description: "Get card profile/details by card account ID",
      inputSchema: {
        id: z.number().describe("Card account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/Profile/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_spend_rules",
    {
      description: "Get spending rules for a specific card",
      inputSchema: {
        id: z.number().describe("Card account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/SpendRules/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_advanced_spend_rules",
    {
      description: "Get advanced spending rules for a specific card",
      inputSchema: {
        id: z.number().describe("Card account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/SpendRules/${id}/Advanced`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_load_limit_remaining",
    {
      description: "Get remaining card load limit for a specific card",
      inputSchema: {
        id: z.number().describe("Card account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/LoadLimitRemaining/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_order",
    {
      description: "Get a specific card order by ID",
      inputSchema: {
        id: z.number().describe("Card order ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/CardOrder/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_scheduled_funding_rules",
    {
      description: "Get scheduled funding rules for a specific card",
      inputSchema: {
        id: z.number().describe("Card account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Card/ScheduledFundingRules/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_card_orders",
    {
      description: "Get card orders within an optional date range",
      inputSchema: {
        startDate: z.string().optional().describe("Start date (ISO 8601)"),
        endDate: z.string().optional().describe("End date (ISO 8601)"),
      },
    },
    async ({ startDate, endDate }) => {
      try {
        const result = await client.get("/Card/CardOrder", {
          StartDate: startDate,
          EndDate: endDate,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

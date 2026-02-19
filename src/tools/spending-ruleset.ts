import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError, paginateArray } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_list_spending_rulesets",
    { description: "Get all spending rulesets for the business" },
    async () => {
      try {
        const result = await client.get("/SpendingRuleset");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_spending_ruleset",
    {
      description: "Get a specific spending ruleset by ID",
      inputSchema: {
        id: z.number().describe("Ruleset ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/SpendingRuleset/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_spending_ruleset_cards",
    {
      description: "Get cards assigned to a specific spending ruleset. Results are paginated.",
      inputSchema: {
        id: z.number().describe("Ruleset ID"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ id, page, pageSize }) => {
      try {
        const result = await client.get(`/SpendingRuleset/${id}/Cards`);
        const paginated = paginateArray(result as unknown[], { page, pageSize });
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_list_advanced_spending_rulesets",
    { description: "Get all advanced spending rulesets for the business" },
    async () => {
      try {
        const result = await client.get("/SpendingRuleset/Advanced");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_mcc_categories",
    {
      description:
        "Get Merchant Category Code (MCC) categories. Filter by predefined and/or custom categories.",
      inputSchema: {
        includePredefined: z.boolean().optional().describe("Include predefined categories"),
        includeCustom: z.boolean().optional().describe("Include custom categories"),
      },
    },
    async ({ includePredefined, includeCustom }) => {
      try {
        const result = await client.get("/SpendingRuleset/MccCategories", {
          includePredefined,
          includeCustom,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_advanced_spending_ruleset",
    {
      description: "Get a specific advanced spending ruleset by ID",
      inputSchema: {
        id: z.number().describe("Ruleset ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/SpendingRuleset/${id}/Advanced`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_advanced_spending_ruleset_cards",
    {
      description: "Get cards assigned to a specific advanced spending ruleset. Results are paginated.",
      inputSchema: {
        id: z.number().describe("Ruleset ID"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ id, page, pageSize }) => {
      try {
        const result = await client.get(`/SpendingRuleset/${id}/Advanced/Cards`);
        const paginated = paginateArray(result as unknown[], { page, pageSize });
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

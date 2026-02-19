import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError, paginateArray, paginateNestedArray } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_account_details",
    {
      description: "Get cardholder account details by account ID",
      inputSchema: {
        id: z.number().describe("Account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Details/AccountDetails/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_advanced_account_details",
    {
      description: "Get advanced cardholder account details by account ID",
      inputSchema: {
        id: z.number().describe("Account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Details/AccountDetails/${id}/Advanced`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_network_transactions",
    {
      description: "Get network transactions for the business within a date range. Results are paginated.",
      inputSchema: {
        startDate: z.string().describe("Start date (ISO 8601)"),
        endDate: z.string().describe("End date (ISO 8601)"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ startDate, endDate, page, pageSize }) => {
      try {
        const result = await client.get("/Details/NetworkTransactions", {
          StartDate: startDate,
          EndDate: endDate,
        });
        const paginated = paginateNestedArray(
          result as Record<string, unknown>,
          "TransactionList",
          { page, pageSize }
        );
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_network_transactions",
    {
      description: "Get network transactions for a specific cardholder within a date range",
      inputSchema: {
        id: z.number().describe("Cardholder account ID"),
        startDate: z.string().describe("Start date (ISO 8601)"),
        endDate: z.string().describe("End date (ISO 8601)"),
      },
    },
    async ({ id, startDate, endDate }) => {
      try {
        const result = await client.get(`/Details/${id}/NetworkTransactions`, {
          StartDate: startDate,
          EndDate: endDate,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_transaction_detail",
    {
      description: "Get transaction details for a specific transaction by ID",
      inputSchema: {
        id: z.number().describe("Transaction ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Details/TransactionDetails/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_all_account_details",
    {
      description: "Get all cardholder account details for the business. Results are paginated to handle large datasets.",
      inputSchema: {
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ page, pageSize }) => {
      try {
        const result = await client.get("/Details/AccountDetails");
        const paginated = paginateNestedArray(
          result as Record<string, unknown>,
          "CHAccountList",
          { page, pageSize }
        );
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_account_balance",
    {
      description: "Get account balance for a specific cardholder",
      inputSchema: {
        id: z.number().describe("Account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Details/AccountDetails/${id}/Balance`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_account_remaining_limits",
    {
      description: "Get remaining spending limits for a specific cardholder",
      inputSchema: {
        id: z.number().describe("Account ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Details/AccountDetails/${id}/RemainingLimits`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_transaction_details",
    {
      description: "Get transaction details for the business within a date range. Results are paginated.",
      inputSchema: {
        startDate: z.string().describe("Start date (ISO 8601)"),
        endDate: z.string().describe("End date (ISO 8601)"),
        includePendings: z.boolean().optional().describe("Include pending transactions"),
        includeDeclines: z.boolean().optional().describe("Include declined transactions"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ startDate, endDate, includePendings, includeDeclines, page, pageSize }) => {
      try {
        const result = await client.get("/Details/TransactionDetails", {
          StartDate: startDate,
          EndDate: endDate,
          IncludePendings: includePendings,
          IncludeDeclines: includeDeclines,
        });
        const paginated = paginateNestedArray(
          result as Record<string, unknown>,
          "TransactionList",
          { page, pageSize }
        );
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_all_cardholder_transactions",
    {
      description: "Get all cardholder transactions within a date range. Results are paginated.",
      inputSchema: {
        startDate: z.string().describe("Start date (ISO 8601)"),
        endDate: z.string().describe("End date (ISO 8601)"),
        includePendings: z.boolean().optional().describe("Include pending transactions"),
        includeDeclines: z.boolean().optional().describe("Include declined transactions"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ startDate, endDate, includePendings, includeDeclines, page, pageSize }) => {
      try {
        const result = await client.get("/Details/AllCardholderTransactions", {
          StartDate: startDate,
          EndDate: endDate,
          IncludePendings: includePendings,
          IncludeDeclines: includeDeclines,
        });
        const paginated = paginateNestedArray(
          result as Record<string, unknown>,
          "TransactionList",
          { page, pageSize }
        );
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

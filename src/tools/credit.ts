import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_credit_lines",
    { description: "Get credit line information for the business" },
    async () => {
      try {
        const result = await client.get("/CreditLinesInfo");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_invoices",
    {
      description: "Get business invoices starting from a given date",
      inputSchema: {
        startDate: z.string().describe("Start date (ISO 8601 date-time)"),
      },
    },
    async ({ startDate }) => {
      try {
        const result = await client.get("/Invoices", { startDate });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_invoice_allocations",
    {
      description: "Get allocations for a specific invoice",
      inputSchema: {
        id: z.number().describe("Invoice ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Invoice/${id}/Allocations`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_invoice_payments",
    {
      description: "Get payments for a specific invoice",
      inputSchema: {
        id: z.number().describe("Invoice ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Invoice/${id}/Payments`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

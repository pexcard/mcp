import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_bill",
    {
      description: "Get bill payment details by bill ID",
      inputSchema: {
        billId: z.number().describe("Bill ID"),
      },
    },
    async ({ billId }) => {
      try {
        const result = await client.get(`/Bill/${billId}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_bill_payments",
    {
      description: "Get payments for a specific bill",
      inputSchema: {
        billId: z.number().describe("Bill ID"),
      },
    },
    async ({ billId }) => {
      try {
        const result = await client.get(`/Bill/${billId}/Payments`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_bill_payment_request",
    {
      description: "Get a specific bill payment request by ID",
      inputSchema: {
        id: z.number().describe("Bill payment request ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/BillPaymentRequest/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_search_bills",
    {
      description: "Search bills with optional filters",
      inputSchema: {
        createdDateFrom: z.string().optional().describe("Created date from (ISO 8601)"),
        createdDateTo: z.string().optional().describe("Created date to (ISO 8601)"),
        dueDateFrom: z.string().optional().describe("Due date from (ISO 8601)"),
        dueDateTo: z.string().optional().describe("Due date to (ISO 8601)"),
        vendorId: z.number().optional().describe("Filter by vendor ID"),
        page: z.number().optional().describe("Page number"),
        pageSize: z.number().optional().describe("Page size"),
      },
    },
    async ({ createdDateFrom, createdDateTo, dueDateFrom, dueDateTo, vendorId, page, pageSize }) => {
      try {
        const result = await client.get("/Bill", {
          CreatedDateFrom: createdDateFrom,
          CreatedDateTo: createdDateTo,
          DueDateFrom: dueDateFrom,
          DueDateTo: dueDateTo,
          VendorId: vendorId,
          Page: page,
          PageSize: pageSize,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

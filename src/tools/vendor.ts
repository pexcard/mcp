import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_list_vendors",
    {
      description:
        "Get paginated list of vendors with optional filtering by cardholder, status, and status trigger",
      inputSchema: {
        cardholderAcctId: z.number().optional().describe("Filter by cardholder account ID"),
        vendorStatuses: z
          .array(z.string())
          .optional()
          .describe("Filter by vendor status. Valid values: Draft, Pending, Onboarded, Closed"),
        vendorStatusTriggers: z
          .array(z.string())
          .optional()
          .describe(
            "Filter by vendor status trigger. Valid values: New, Submitted, Active, Inactive, Rejected, Offboarded"
          ),
        pageIndex: z.number().optional().describe("Page index (1-based, range: 1–1000000)"),
        pageSize: z.number().optional().describe("Results per page (range: 1–1000)"),
      },
    },
    async ({ cardholderAcctId, vendorStatuses, vendorStatusTriggers, pageIndex, pageSize }) => {
      try {
        const result = await client.get("/Vendor", {
          CardholderAcctId: cardholderAcctId,
          VendorStatuses: vendorStatuses?.join(","),
          VendorStatusTriggers: vendorStatusTriggers?.join(","),
          PageIndex: pageIndex,
          PageSize: pageSize,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_vendor",
    {
      description: "Get a specific vendor by ID",
      inputSchema: {
        id: z.number().describe("Vendor ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Vendor/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

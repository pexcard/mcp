import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_vendor_card_order",
    {
      description: "Get vendor card order details by order ID",
      inputSchema: {
        orderId: z.number().describe("Vendor card order ID"),
      },
    },
    async ({ orderId }) => {
      try {
        const result = await client.get(`/VendorCard/Order/${orderId}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

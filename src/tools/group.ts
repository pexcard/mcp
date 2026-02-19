import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError, paginateArray } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_list_groups",
    { description: "Get all cardholder groups for the business" },
    async () => {
      try {
        const result = await client.get("/Group");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_group_cardholders",
    {
      description: "Get cardholders belonging to a specific group. Results are paginated.",
      inputSchema: {
        id: z.number().describe("Group ID"),
        page: z.number().optional().default(1).describe("Page number (1-based, default: 1)"),
        pageSize: z.number().optional().default(50).describe("Results per page (default: 50, max: 100)"),
      },
    },
    async ({ id, page, pageSize }) => {
      try {
        const result = await client.get(`/Group/${id}`);
        const paginated = paginateArray(result as unknown[], { page, pageSize });
        return toolResponse(paginated);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

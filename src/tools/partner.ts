import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_partner",
    { description: "Get partner details for the current business" },
    async () => {
      try {
        const result = await client.get("/Partner");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

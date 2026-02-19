import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_current_token",
    { description: "Get details of the current authentication token" },
    async () => {
      try {
        const result = await client.get("/Token/Current");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_list_tokens",
    { description: "Get all tokens for the authenticated user" },
    async () => {
      try {
        const result = await client.get("/Token");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_auth_tokens",
    { description: "Get a list of basic token details for the authenticated user and app" },
    async () => {
      try {
        const result = await client.get("/Token/GetAuthTokens");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

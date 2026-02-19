import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_business_profile",
    { description: "Get business profile details including name, address, phone, and status" },
    async () => {
      try {
        const result = await client.get("/Business/Profile");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_balance",
    { description: "Get business account balance" },
    async () => {
      try {
        const result = await client.get("/Business/Balance");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_admins",
    { description: "Get list of all business administrators" },
    async () => {
      try {
        const result = await client.get("/Business/Admin");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_admin",
    {
      description: "Get a specific business administrator by ID",
      inputSchema: {
        id: z.number().describe("Administrator ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Business/Admin/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_tags",
    { description: "Get all business tags" },
    async () => {
      try {
        const result = await client.get("/Business/Configuration/Tags");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_tag",
    {
      description: "Get a specific business tag by ID",
      inputSchema: {
        id: z.number().describe("Tag ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/Business/Configuration/Tag/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_linked",
    { description: "Get linked businesses" },
    async () => {
      try {
        const result = await client.get("/Business/Linked");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_bank_account",
    { description: "Get business bank account details" },
    async () => {
      try {
        const result = await client.get("/Business/BankAccount");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_one_time_transfer",
    { description: "Get business one-time transfer details" },
    async () => {
      try {
        const result = await client.get("/Business/OneTimeTransfer");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_my_profile",
    { description: "Get the current user's business profile" },
    async () => {
      try {
        const result = await client.get("/Business/MyProfile");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_billing",
    {
      description:
        "Get business billing information for a specific month. Current month values are estimates; finalized after billing cycle ends.",
      inputSchema: {
        month: z.number().describe("Month (1–12)"),
        year: z.number().describe("Year (e.g. 2025)"),
      },
    },
    async ({ month, year }) => {
      try {
        const result = await client.get("/Business/Billing", { Month: month, Year: year });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_settings",
    { description: "Get business settings" },
    async () => {
      try {
        const result = await client.get("/Business/Settings");
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

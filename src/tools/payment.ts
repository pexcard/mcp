import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_payments",
    {
      description:
        "Get paginated list of business payments with optional filtering by status, dates, etc.",
      inputSchema: {
        page: z.number().optional().describe("Page number (1-based)"),
        size: z.number().optional().describe("Results per page"),
        paymentStatuses: z
          .array(z.string())
          .optional()
          .describe(
            "Filter by payment status. Valid values: Draft, Pending, Closed, Exception, InProgress"
          ),
        paymentStatusTriggers: z
          .array(z.string())
          .optional()
          .describe(
            "Filter by status trigger. Valid values: New, OutboundAchCreationError, Settling, OutBoundAchCheckStatusError, AwaitingOutboundCompletion, Settled, Returned, Cancelled, InProgress, VirtualCardCreated, VirtualCardEnsureSpendingRuleset, VirtualCardDeliveryCreated, VirtualCardDetailsRequestCreated, VirtualCardCreationError, VirtualCardEnsureSpendingRulesetError, VirtualCardDeliveryCreationError, VirtualCardDetailsRequestCreationError"
          ),
        outboundAchCreationStartDate: z
          .string()
          .optional()
          .describe("ACH creation start date (ISO 8601)"),
        outboundAchCreationEndDate: z
          .string()
          .optional()
          .describe("ACH creation end date (ISO 8601)"),
        expectedPaymentStartDate: z
          .string()
          .optional()
          .describe("Expected payment start date (ISO 8601)"),
        expectedPaymentEndDate: z
          .string()
          .optional()
          .describe("Expected payment end date (ISO 8601)"),
      },
    },
    async ({
      page,
      size,
      paymentStatuses,
      paymentStatusTriggers,
      outboundAchCreationStartDate,
      outboundAchCreationEndDate,
      expectedPaymentStartDate,
      expectedPaymentEndDate,
    }) => {
      try {
        const result = await client.get("/Payments", {
          Page: page,
          Size: size,
          PaymentStatuses: paymentStatuses?.join(","),
          PaymentStatusTriggers: paymentStatusTriggers?.join(","),
          OutboundAchCreationStartDate: outboundAchCreationStartDate,
          OutboundAchCreationEndDate: outboundAchCreationEndDate,
          ExpectedPaymentStartDate: expectedPaymentStartDate,
          ExpectedPaymentEndDate: expectedPaymentEndDate,
        });
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_payment_transfer",
    {
      description: "Get a specific payment transfer by ID",
      inputSchema: {
        id: z.number().describe("Transfer ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/PaymentTransfers/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_payment_request",
    {
      description: "Get a specific payment request by ID",
      inputSchema: {
        id: z.number().describe("Payment request ID"),
      },
    },
    async ({ id }) => {
      try {
        const result = await client.get(`/PaymentRequests/${id}`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

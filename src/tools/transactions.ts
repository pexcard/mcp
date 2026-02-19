import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";
import { toolResponse, toolError } from "./utils.js";

// Common pagination schema fields
const paginationSchema = {
  minDate: z
    .string()
    .optional()
    .describe("Filter transactions on or after this date-time (eastern time, ISO 8601)"),
  maxDate: z
    .string()
    .optional()
    .describe("Filter transactions on or before this date-time (eastern time, ISO 8601)"),
  onDate: z
    .string()
    .optional()
    .describe(
      "Filter transactions on this exact date (eastern time, ISO 8601). Cannot be combined with minDate/maxDate"
    ),
  minAmount: z.number().optional().describe("Filter transactions with amount >= this value"),
  maxAmount: z.number().optional().describe("Filter transactions with amount <= this value"),
  equalsAmount: z
    .number()
    .optional()
    .describe(
      "Filter transactions with amount exactly equal to this value. Cannot be combined with minAmount/maxAmount"
    ),
  page: z.number().optional().describe("Page number (1-based, default: 1, max: 2147483647)"),
  pageSize: z.number().optional().describe("Results per page (default: 100, range: 1–1000)"),
  sortBy: z
    .string()
    .optional()
    .describe(
      "Sort results by property. Valid values: TransactionTime (default), Amount, Description"
    ),
  orderBy: z.string().optional().describe("Sort direction. Valid values: Asc, Desc (default)"),
};

const categoryFilterSchema = {
  onlyCategoryIds: z
    .array(z.number())
    .optional()
    .describe("Only include transactions in these category IDs"),
  notCategoryIds: z
    .array(z.number())
    .optional()
    .describe("Exclude transactions in these category IDs"),
};


export function register(server: McpServer, client: PexClient): void {
  server.registerTool(
    "pex_get_business_transactions",
    {
      description:
        "Get paginated business transactions with optional date, amount, and category filters",
      inputSchema: {
        ...paginationSchema,
        ...categoryFilterSchema,
      },
    },
    async (args) => {
      try {
        const result = await client.get("/Transactions/Business/Transactions", args);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_business_transaction",
    {
      description: "Get a specific business transaction by ID",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
      },
    },
    async ({ transactionId }) => {
      try {
        const result = await client.get(
          `/Transactions/Business/Transactions/${transactionId}`
        );
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_transactions",
    {
      description:
        "Get paginated cardholder transactions. Optionally filter by cardholder account ID.",
      inputSchema: {
        cardholderAccountId: z
          .number()
          .optional()
          .describe("Optional cardholder account ID to scope results"),
        ...paginationSchema,
        ...categoryFilterSchema,
      },
    },
    async ({ cardholderAccountId, ...rest }) => {
      try {
        const base = cardholderAccountId
          ? `/Transactions/Cardholder/${cardholderAccountId}/Transactions`
          : "/Transactions/Cardholder/Transactions";
        const result = await client.get(base, rest);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_transaction",
    {
      description:
        "Get a specific cardholder transaction by transaction ID, optionally scoped to a cardholder",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
        cardholderAccountId: z
          .number()
          .optional()
          .describe("Optional cardholder account ID to scope the lookup"),
      },
    },
    async ({ transactionId, cardholderAccountId }) => {
      try {
        const base = cardholderAccountId
          ? `/Transactions/Cardholder/${cardholderAccountId}/Transactions/${transactionId}`
          : `/Transactions/Cardholder/Transactions/${transactionId}`;
        const result = await client.get(base);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_purchases",
    {
      description:
        "Get paginated cardholder purchases. Optionally filter by cardholder account ID and approval status.",
      inputSchema: {
        cardholderAccountId: z
          .number()
          .optional()
          .describe("Optional cardholder account ID to scope results"),
        approval: z
          .array(z.string())
          .optional()
          .describe(
            "Filter by approval/review status. Valid values: NotReviewed, Ignored, Approved, Rejected, NoReceipt"
          ),
        ...paginationSchema,
      },
    },
    async ({ cardholderAccountId, ...rest }) => {
      try {
        const base = cardholderAccountId
          ? `/Transactions/Cardholder/${cardholderAccountId}/Purchases`
          : "/Transactions/Cardholder/Purchases";
        const result = await client.get(base, rest);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_purchase",
    {
      description:
        "Get a specific cardholder purchase by transaction ID, optionally scoped to a cardholder",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
        cardholderAccountId: z
          .number()
          .optional()
          .describe("Optional cardholder account ID to scope the lookup"),
      },
    },
    async ({ transactionId, cardholderAccountId }) => {
      try {
        const base = cardholderAccountId
          ? `/Transactions/Cardholder/${cardholderAccountId}/Purchases/${transactionId}`
          : `/Transactions/Cardholder/Purchases/${transactionId}`;
        const result = await client.get(base);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_cardholder_declines",
    {
      description:
        "Get paginated cardholder declines. Optionally filter by cardholder account ID.",
      inputSchema: {
        cardholderAccountId: z
          .number()
          .optional()
          .describe("Optional cardholder account ID to scope results"),
        ...paginationSchema,
      },
    },
    async ({ cardholderAccountId, ...rest }) => {
      try {
        const base = cardholderAccountId
          ? `/Transactions/Cardholder/${cardholderAccountId}/Declines`
          : "/Transactions/Cardholder/Declines";
        const result = await client.get(base, rest);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_transaction_attachments",
    {
      description: "Get all attachments for a transaction",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
      },
    },
    async ({ transactionId }) => {
      try {
        const result = await client.get(`/Transactions/${transactionId}/Attachments`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_transaction_attachment",
    {
      description: "Get a specific attachment for a transaction",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
        attachmentId: z.string().describe("Attachment ID"),
        attachmentLinkType: z
          .string()
          .optional()
          .describe(
            "How to return the attachment. Valid values: LinkUrl (default), Full, Thumbnail, Preview"
          ),
      },
    },
    async ({ transactionId, attachmentId, attachmentLinkType }) => {
      try {
        const result = await client.get(
          `/Transactions/${transactionId}/Attachment/${attachmentId}`,
          { AttachmentLinkType: attachmentLinkType }
        );
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );

  server.registerTool(
    "pex_get_transaction_tags",
    {
      description: "Get tags for a specific transaction",
      inputSchema: {
        transactionId: z.number().describe("Transaction ID"),
      },
    },
    async ({ transactionId }) => {
      try {
        const result = await client.get(`/Transactions/${transactionId}/Tags`);
        return toolResponse(result);
      } catch (error) {
        return toolError(error);
      }
    }
  );
}

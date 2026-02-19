import { PexClientError } from "../pex-client.js";
import { logger } from "../logger.js";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

/**
 * Applies client-side pagination to an array of results.
 * Use this for API endpoints that don't support server-side pagination.
 */
export function paginateArray<T>(
  items: T[],
  params: PaginationParams = {}
): PaginatedResult<T> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Extracts an array from a nested response object and paginates it.
 * Useful for responses like { CHAccountList: [...] } or { Groups: [...] }
 */
export function paginateNestedArray<T>(
  response: Record<string, unknown>,
  arrayKey: string,
  params: PaginationParams = {}
): { data: Record<string, unknown>; pagination: PaginatedResult<T>["pagination"] } {
  const items = (response[arrayKey] as T[]) ?? [];
  const paginated = paginateArray(items, params);

  return {
    data: {
      ...response,
      [arrayKey]: paginated.data,
    },
    pagination: paginated.pagination,
  };
}

export function toolResponse(result: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

export function toolError(error: unknown) {
  const message =
    error instanceof PexClientError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

  logger.error("Tool call error", { error: message });

  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

import { logger } from "./logger.js";

export class PexClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: string
  ) {
    super(message);
    this.name = "PexClientError";
  }
}

export class PexClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    const baseUrl = process.env.PEX_API_URL;
    const token = process.env.PEX_API_TOKEN;

    if (!baseUrl) {
      throw new Error("PEX_API_URL environment variable is required");
    }
    if (!token) {
      throw new Error("PEX_API_TOKEN environment variable is required");
    }

    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
  }

  async get(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean | string[] | number[] | undefined>
  ): Promise<unknown> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(","));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      }
    }

    const urlString = url.toString();
    logger.info("PEX API request", { method: "GET", endpoint });

    const init: RequestInit = {
      method: "GET",
      headers: {
        Authorization: `Token ${this.token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30_000),
    };

    let response: Response;
    try {
      response = await this.fetchWithRetry(urlString, init);
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        logger.error("Request timed out", { endpoint });
        throw new PexClientError("Request timed out after 30s", 0);
      }
      if (error instanceof TypeError && (error as NodeJS.ErrnoException).code === "ABORT_ERR") {
        logger.error("Request timed out", { endpoint });
        throw new PexClientError("Request timed out after 30s", 0);
      }
      throw error;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => undefined);
      const message = this.mapErrorMessage(response.status, body);
      logger.error("PEX API error", {
        endpoint,
        status: response.status,
        body: body?.slice(0, 200),
      });
      throw new PexClientError(message, response.status, body);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }

  private async fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    const maxAttempts = 3;
    const baseDelay = 500;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, init);
        if (attempt < maxAttempts && this.isRetryableStatus(response.status)) {
          logger.warn("Retrying request", { attempt, status: response.status, url });
          await this.delay(baseDelay * Math.pow(2, attempt - 1));
          continue;
        }
        return response;
      } catch (error) {
        if (attempt < maxAttempts && this.isNetworkError(error)) {
          logger.warn("Retrying after network error", { attempt, url });
          await this.delay(baseDelay * Math.pow(2, attempt - 1));
          continue;
        }
        throw error;
      }
    }

    // Unreachable, but TypeScript needs it
    throw new Error("fetchWithRetry: exhausted all attempts");
  }

  private isRetryableStatus(status: number): boolean {
    return status === 502 || status === 503 || status === 504;
  }

  private isNetworkError(error: unknown): boolean {
    return (
      error instanceof TypeError &&
      error.message !== "Failed to parse URL" &&
      !("status" in error)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private mapErrorMessage(status: number, body?: string): string {
    switch (status) {
      case 401:
        return "Authentication failed. Check your PEX_API_TOKEN.";
      case 403:
        return "Access denied. Your account may lack the required permissions or features.";
      case 404:
        return "Resource not found.";
      case 429:
        return "Rate limit exceeded. Try again later.";
      default:
        return `PEX API error (${status}): ${body ?? "Unknown error"}`;
    }
  }
}

# AGENTS.md

Instructions for AI coding agents working on this project.

## Project Overview

A **Model Context Protocol (MCP) server** in TypeScript that wraps the PEX Card External API as 72 read-only tools. Runs as a stdio-based process using `@modelcontextprotocol/sdk`. Read-only by design — only GET endpoints are exposed.

## Build & Run

```bash
npm ci                # install dependencies
npm run build         # compile TypeScript (tsc → dist/)
npm run dev           # run in development mode (tsx, no build needed)
npm start             # run compiled output (dist/index.js)
npm audit --audit-level=high  # check for vulnerabilities
```

There are no tests yet. Do not add a `npm test` step to scripts without being asked.

## Project Structure

```
src/
├── index.ts              # Entry point: creates server, registers tools, connects transport
├── pex-client.ts         # HTTP client (GET-only, retry, error handling)
├── logger.ts             # JSON structured logger (writes to stderr only)
├── types.ts              # Shared type: ToolRegistrar
└── tools/
    ├── index.ts           # Aggregator — calls all register() functions
    ├── utils.ts           # toolResponse, toolError, paginateArray, paginateNestedArray
    ├── business.ts        # 12 tools
    ├── card.ts            # 7 tools
    ├── transactions.ts    # 10 tools
    ├── details.ts         # 10 tools
    ├── spending-ruleset.ts # 7 tools
    ├── bill.ts            # 4 tools
    ├── vendor.ts          # 2 tools
    ├── vendor-card.ts     # 1 tool
    ├── payment.ts         # 3 tools
    ├── credit.ts          # 4 tools
    ├── group.ts           # 2 tools
    ├── token.ts           # 3 tools
    ├── token-provisioning.ts # 3 tools
    ├── callback.ts        # 3 tools
    └── partner.ts         # 1 tool
```

## Architecture

**Entry point** (`src/index.ts`): Creates `McpServer`, instantiates `PexClient`, calls `registerAllTools()`, and connects via `StdioServerTransport`. All logging goes to **stderr** to keep stdout clean for MCP protocol.

**PexClient** (`src/pex-client.ts`): Lean HTTP client with:
- Only a `get()` method — this server is read-only
- Retry logic: 3 attempts with exponential backoff (500ms, 1000ms) on 502/503/504 and network errors
- 30-second timeout via `AbortSignal.timeout(30_000)`
- Custom `PexClientError` with status code and body
- User-friendly error messages for 401/403/404/429

**Tool files** (`src/tools/*.ts`): Each file exports a single `register(server, client)` function. The aggregator in `tools/index.ts` calls them all.

## Key Conventions

### Adding a New Tool

1. Choose the appropriate domain file in `src/tools/` or create a new one if it's a new domain.
2. Register with `server.registerTool()` following this pattern:

```typescript
server.registerTool(
  "pex_get_something",              // snake_case, pex_ prefix
  {
    description: "Short description",
    inputSchema: {                   // Zod schema object (omit if no params)
      id: z.number().describe("Resource ID"),
    },
  },
  async (args) => {
    try {
      const result = await client.get("/Endpoint", args);
      return toolResponse(result);
    } catch (error) {
      return toolError(error);
    }
  }
);
```

3. If creating a new file, export a `register` function and add it to `src/tools/index.ts`.
4. Update the tool count in `README.md` if the total changes.

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Tool names | `pex_{verb}_{domain}` snake_case | `pex_get_business_profile` |
| File names | `kebab-case.ts` | `spending-ruleset.ts` |
| Functions | `camelCase` | `registerBusiness` |
| Classes | `PascalCase` | `PexClient` |
| Zod schema params | `camelCase` | `cardholderAccountId` |
| API query params | `PascalCase` (matching PEX API) | `StartDate`, `PageSize` |

### Tool Name Verbs

- `get_` — single resource by ID or singleton endpoint
- `list_` — collection without required ID
- `search_` — filtered/searched collections

### Imports

This project uses ESM (`"type": "module"` in package.json) with `"module": "Node16"` in tsconfig. **All local imports must include `.js` extension:**

```typescript
import { PexClient } from "./pex-client.js";        // correct
import { PexClient } from "./pex-client";            // wrong — will fail at runtime
```

### Error Handling

Every tool handler must wrap its logic in try/catch and return structured responses:
- Success: `return toolResponse(result)`
- Error: `return toolError(error)`

Never throw from a tool handler. Always return an MCP-formatted response.

### Pagination

Two strategies are used:

1. **Server-side**: Pass pagination params directly to the PEX API (`Page`, `PageSize`, date filters, etc.)
2. **Client-side**: Use `paginateArray()` for flat arrays or `paginateNestedArray()` for nested response objects when the API returns all data at once. Defaults: page=1, pageSize=50, max=100.

### Zod Schemas

- Define inline as plain objects (not wrapped in `z.object()`) — the MCP SDK handles wrapping
- Always use `.describe()` to document parameters, including valid values
- Use `.optional()` for non-required fields
- Use `.default()` for pagination defaults
- Spread shared schemas for reuse: `inputSchema: { ...paginationSchema, id: z.number() }`

## Environment Variables

```
PEX_API_URL    # Required. PEX API base URL (e.g., https://coreapi.pexcard.com/v4)
PEX_API_TOKEN  # Required. API authentication token
```

Both are required at startup. Missing either causes an immediate crash with a descriptive error.

## TypeScript Configuration

- Target: ES2022, Module: Node16, Strict: true
- Output: `dist/` with declarations and source maps
- Source: `src/` as root directory

## Things to Avoid

- Do not add POST/PUT/PATCH/DELETE tools without explicit approval — the server is read-only by design
- Do not log to stdout — it interferes with the MCP stdio transport; use `logger` (stderr) instead
- Do not add external dependencies without justification — the project intentionally has a minimal footprint
- Do not modify the MCP protocol transport or server initialization pattern without understanding the implications

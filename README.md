# PEX MCP Server

A Model Context Protocol (MCP) server that provides access to the [PEX Card External API](https://developer.pexcard.com/). Use this server to let AI assistants like Claude interact with your PEX business account, cards, transactions, and more.

## Installation

```bash
npx @pexcard_engineering/mcp
```

Or install globally:

```bash
npm install -g @pexcard_engineering/mcp
pex-mcp-server
```

## Getting Your PEX API Token

To use the PEX MCP Server, you need a PEX API token. Follow these steps to generate one:

1. Log in to the [PEX Dashboard](https://dashboard.pexcard.com) using your credentials.
2. Navigate to **Profile** > **Authorized Apps** (or go directly to `/account/authorized-apps`).
3. Find the **PEX MCP Server** application and click on it.
4. Click **Generate Token** and copy the token value.

> **Note:** Keep your API token secure. Do not commit it to version control or share it publicly.

## Configuration

Set the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `PEX_API_URL` | Yes | PEX API base URL (e.g., `https://coreapi.pexcard.com/v4`) |
| `PEX_API_TOKEN` | Yes | Your PEX API token (see [Getting Your PEX API Token](#getting-your-pex-api-token)) |

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pex": {
      "command": "npx",
      "args": ["-y", "@pexcard_engineering/mcp"],
      "env": {
        "PEX_API_URL": "https://coreapi.pexcard.com/v4",
        "PEX_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Config file locations

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Usage with Claude Code (CLI)

Add the MCP server using the Claude Code CLI:

```bash
claude mcp add pex -e PEX_API_URL=https://coreapi.pexcard.com/v4 -e PEX_API_TOKEN=your-api-token-here -- npx -y @pexcard_engineering/mcp
```

Or add it manually to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "pex": {
      "command": "npx",
      "args": ["-y", "@pexcard_engineering/mcp"],
      "env": {
        "PEX_API_URL": "https://coreapi.pexcard.com/v4",
        "PEX_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

## Usage with GitHub Copilot

### VS Code

Add the following to your VS Code settings (`.vscode/settings.json` or user settings):

```json
{
  "github.copilot.chat.mcpServers": {
    "pex": {
      "command": "npx",
      "args": ["-y", "@pexcard_engineering/mcp"],
      "env": {
        "PEX_API_URL": "https://coreapi.pexcard.com/v4",
        "PEX_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Alternatively, create an `.mcp.json` file in your project root:

```json
{
  "servers": {
    "pex": {
      "command": "npx",
      "args": ["-y", "@pexcard_engineering/mcp"],
      "env": {
        "PEX_API_URL": "https://coreapi.pexcard.com/v4",
        "PEX_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

> **Tip:** When using `.mcp.json`, add it to your `.gitignore` if it contains your actual token, or use environment variable references to keep secrets out of source control.

## Available Tools (72 total)

### Business (12 tools)
| Tool | Description |
|------|-------------|
| `pex_get_business_profile` | Get business profile details including name, address, phone, and status |
| `pex_get_business_balance` | Get business account balance |
| `pex_get_business_admins` | Get list of all business administrators |
| `pex_get_business_admin` | Get a specific business administrator by ID |
| `pex_get_business_tags` | Get all business tags |
| `pex_get_business_tag` | Get a specific business tag by ID |
| `pex_get_business_linked` | Get linked businesses |
| `pex_get_business_bank_account` | Get business bank account details |
| `pex_get_business_one_time_transfer` | Get business one-time transfer details |
| `pex_get_business_my_profile` | Get the current user's business profile |
| `pex_get_business_billing` | Get business billing information for a specific month |
| `pex_get_business_settings` | Get business settings |

### Cards (7 tools)
| Tool | Description |
|------|-------------|
| `pex_get_card` | Get card profile/details by card account ID |
| `pex_get_card_spend_rules` | Get spending rules for a specific card |
| `pex_get_card_advanced_spend_rules` | Get advanced spending rules for a specific card |
| `pex_get_card_load_limit_remaining` | Get remaining card load limit for a specific card |
| `pex_get_card_scheduled_funding_rules` | Get scheduled funding rules for a specific card |
| `pex_get_card_order` | Get a specific card order by ID |
| `pex_get_card_orders` | Get card orders within an optional date range |

### Transactions (10 tools)
| Tool | Description |
|------|-------------|
| `pex_get_business_transactions` | Get paginated business transactions with filters |
| `pex_get_business_transaction` | Get a specific business transaction by ID |
| `pex_get_cardholder_transactions` | Get paginated cardholder transactions |
| `pex_get_cardholder_transaction` | Get a specific cardholder transaction by ID |
| `pex_get_cardholder_purchases` | Get paginated cardholder purchases |
| `pex_get_cardholder_purchase` | Get a specific cardholder purchase by ID |
| `pex_get_cardholder_declines` | Get paginated cardholder declines |
| `pex_get_transaction_attachments` | Get all attachments for a transaction |
| `pex_get_transaction_attachment` | Get a specific attachment for a transaction |
| `pex_get_transaction_tags` | Get tags for a specific transaction |

### Account Details (10 tools)
| Tool | Description |
|------|-------------|
| `pex_get_account_details` | Get cardholder account details by ID |
| `pex_get_advanced_account_details` | Get advanced cardholder account details by ID |
| `pex_get_all_account_details` | Get all cardholder account details for the business |
| `pex_get_account_balance` | Get account balance for a specific cardholder |
| `pex_get_account_remaining_limits` | Get remaining spending limits for a cardholder |
| `pex_get_network_transactions` | Get network transactions for the business |
| `pex_get_cardholder_network_transactions` | Get network transactions for a specific cardholder |
| `pex_get_transaction_detail` | Get transaction details for a specific transaction |
| `pex_get_transaction_details` | Get transaction details for the business |
| `pex_get_all_cardholder_transactions` | Get all cardholder transactions within a date range |

### Spending Rulesets (7 tools)
| Tool | Description |
|------|-------------|
| `pex_list_spending_rulesets` | Get all spending rulesets for the business |
| `pex_get_spending_ruleset` | Get a specific spending ruleset by ID |
| `pex_get_spending_ruleset_cards` | Get cards assigned to a spending ruleset |
| `pex_list_advanced_spending_rulesets` | Get all advanced spending rulesets |
| `pex_get_advanced_spending_ruleset` | Get a specific advanced spending ruleset by ID |
| `pex_get_advanced_spending_ruleset_cards` | Get cards assigned to an advanced spending ruleset |
| `pex_get_mcc_categories` | Get Merchant Category Code (MCC) categories |

### Bills (4 tools)
| Tool | Description |
|------|-------------|
| `pex_get_bill` | Get bill payment details by bill ID |
| `pex_get_bill_payments` | Get payments for a specific bill |
| `pex_get_bill_payment_request` | Get a specific bill payment request by ID |
| `pex_search_bills` | Search bills with optional filters |

### Vendors (3 tools)
| Tool | Description |
|------|-------------|
| `pex_list_vendors` | Get paginated list of vendors with filters |
| `pex_get_vendor` | Get a specific vendor by ID |
| `pex_get_vendor_card_order` | Get vendor card order details by order ID |

### Payments (3 tools)
| Tool | Description |
|------|-------------|
| `pex_get_payments` | Get paginated list of business payments |
| `pex_get_payment_transfer` | Get a specific payment transfer by ID |
| `pex_get_payment_request` | Get a specific payment request by ID |

### Credit & Invoices (4 tools)
| Tool | Description |
|------|-------------|
| `pex_get_credit_lines` | Get credit line information for the business |
| `pex_get_invoices` | Get business invoices starting from a given date |
| `pex_get_invoice_allocations` | Get allocations for a specific invoice |
| `pex_get_invoice_payments` | Get payments for a specific invoice |

### Groups (2 tools)
| Tool | Description |
|------|-------------|
| `pex_list_groups` | Get all cardholder groups for the business |
| `pex_get_group_cardholders` | Get cardholders belonging to a specific group |

### Tokens (6 tools)
| Tool | Description |
|------|-------------|
| `pex_get_current_token` | Get details of the current authentication token |
| `pex_list_tokens` | Get all tokens for the authenticated user |
| `pex_get_auth_tokens` | Get basic token details for the authenticated user |
| `pex_get_token_provisioning_mode` | Get the business token provisioning mode |
| `pex_get_cardholder_provisioning_mode` | Get token provisioning mode for a cardholder |
| `pex_get_issued_tokens` | Get issued tokens for a specific cardholder |

### Callbacks (3 tools)
| Tool | Description |
|------|-------------|
| `pex_get_callback_types` | Get available callback subscription types |
| `pex_list_callback_subscriptions` | Get all callback subscriptions for the business |
| `pex_get_callback_subscription` | Get a specific callback subscription by ID |

### Partner (1 tool)
| Tool | Description |
|------|-------------|
| `pex_get_partner` | Get partner details for the current business |

## Features

- **Full API Coverage**: 72 tools covering all GET endpoints of the PEX External API
- **Input Validation**: All parameters validated with clear error messages
- **Retry Logic**: Automatic retries with exponential backoff on 502/503/504 errors
- **Request Timeout**: 30-second timeout prevents hanging requests
- **Structured Logging**: JSON logs to stderr for debugging (stdout reserved for MCP)
- **Rich Documentation**: All tool parameters include descriptions, valid values, and constraints

## Example Queries

Once connected, you can ask Claude things like:

- "What's my business account balance?"
- "Show me all transactions from last week over $100"
- "List all cards with their spending limits"
- "What are the spending rules for card 12345?"
- "Show me pending payments"

## License

MIT

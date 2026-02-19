import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PexClient } from "../pex-client.js";

import { register as registerBusiness } from "./business.js";
import { register as registerCard } from "./card.js";
import { register as registerTransactions } from "./transactions.js";
import { register as registerDetails } from "./details.js";
import { register as registerSpendingRuleset } from "./spending-ruleset.js";
import { register as registerGroup } from "./group.js";
import { register as registerToken } from "./token.js";
import { register as registerCallback } from "./callback.js";
import { register as registerCredit } from "./credit.js";
import { register as registerPayment } from "./payment.js";
import { register as registerVendor } from "./vendor.js";
import { register as registerBill } from "./bill.js";
import { register as registerTokenProvisioning } from "./token-provisioning.js";
import { register as registerVendorCard } from "./vendor-card.js";
import { register as registerPartner } from "./partner.js";

export function registerAllTools(server: McpServer, client: PexClient): void {
  registerBusiness(server, client);
  registerCard(server, client);
  registerTransactions(server, client);
  registerDetails(server, client);
  registerSpendingRuleset(server, client);
  registerGroup(server, client);
  registerToken(server, client);
  registerCallback(server, client);
  registerCredit(server, client);
  registerPayment(server, client);
  registerVendor(server, client);
  registerBill(server, client);
  registerTokenProvisioning(server, client);
  registerVendorCard(server, client);
  registerPartner(server, client);
}

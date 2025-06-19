/** @format */

import { handleClerkWebhook } from "../../../../lib/services/userService";

// app/api/webhooks/clerk/route.ts

export async function POST(request: Request) {
  return handleClerkWebhook(request);
}

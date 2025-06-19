/** @format */

import { NextResponse } from "next/server";
import { MessageService } from "../../../../lib/services/messageService";

// app/api/messages/stats/route.ts
export async function GET() {
  try {
    const stats = await MessageService.getMessageStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching message stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch message statistics" },
      { status: 500 }
    );
  }
}

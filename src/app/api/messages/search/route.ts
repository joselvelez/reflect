/** @format */

import { NextRequest, NextResponse } from "next/server";
import { MessageService } from "../../../../lib/services/messageService";

// app/api/messages/search/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const result = await MessageService.searchMessages(query, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching messages:", error);
    return NextResponse.json(
      { error: "Failed to search messages" },
      { status: 500 }
    );
  }
}

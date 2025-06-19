/** @format */

// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MessageService } from "../../../lib/services/messageService";
import { MessageType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      content,
      messageType = MessageType.TEXT,
      receiverId,
      screenshotUrl,
      ocrText,
      ocrConfidence,
      platform,
      externalId,
      timestamp,
    } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const message = await MessageService.createMessage({
      content,
      messageType,
      receiverId,
      screenshotUrl,
      ocrText,
      ocrConfidence,
      platform,
      externalId,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const platform = searchParams.get("platform") || undefined;
    const messageType =
      (searchParams.get("messageType") as MessageType) || undefined;
    const dateFrom = searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom")!)
      : undefined;
    const dateTo = searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo")!)
      : undefined;
    const hasAnalysis = searchParams.get("hasAnalysis")
      ? searchParams.get("hasAnalysis") === "true"
      : undefined;

    const result = await MessageService.getUserMessages(page, limit, {
      platform,
      messageType,
      dateFrom,
      dateTo,
      hasAnalysis,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/** @format */

// lib/services/messageService.ts
import {
  PrismaClient,
  MessageType,
  Message,
  MessageAnalysis,
} from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export interface CreateMessageData {
  content: string;
  messageType: MessageType;
  receiverId?: string;
  screenshotUrl?: string;
  ocrText?: string;
  ocrConfidence?: number;
  platform?: string;
  externalId?: string;
  timestamp?: Date;
}

export interface MessageWithAnalysis extends Message {
  analysis?: MessageAnalysis | null;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  receiver?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
}

export class MessageService {
  /**
   * Create a new message in the database
   */
  static async createMessage(data: CreateMessageData): Promise<Message> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get the user's database ID from Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        messageType: data.messageType,
        senderId: user.id,
        receiverId: data.receiverId,
        screenshotUrl: data.screenshotUrl,
        ocrText: data.ocrText,
        ocrConfidence: data.ocrConfidence,
        platform: data.platform,
        externalId: data.externalId,
        timestamp: data.timestamp || new Date(),
      },
    });

    return message;
  }

  /**
   * Get messages for the current user
   */
  static async getUserMessages(
    page: number = 1,
    limit: number = 20,
    filters?: {
      platform?: string;
      messageType?: MessageType;
      dateFrom?: Date;
      dateTo?: Date;
      hasAnalysis?: boolean;
    }
  ): Promise<{
    messages: MessageWithAnalysis[];
    total: number;
    hasMore: boolean;
  }> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
      isDeleted: false,
    };

    if (filters?.platform) {
      where.platform = filters.platform;
    }

    if (filters?.messageType) {
      where.messageType = filters.messageType;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.timestamp = {};
      if (filters.dateFrom) {
        where.timestamp.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.timestamp.lte = filters.dateTo;
      }
    }

    if (filters?.hasAnalysis !== undefined) {
      if (filters.hasAnalysis) {
        where.analysis = { isNot: null };
      } else {
        where.analysis = null;
      }
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
        include: {
          analysis: true,
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ]);

    return {
      messages: messages as MessageWithAnalysis[],
      total,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Get a specific message by ID
   */
  static async getMessageById(
    messageId: string
  ): Promise<MessageWithAnalysis | null> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        isDeleted: false,
      },
      include: {
        analysis: true,
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return message as MessageWithAnalysis | null;
  }

  /**
   * Update a message
   */
  static async updateMessage(
    messageId: string,
    data: Partial<CreateMessageData>
  ): Promise<Message> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Verify user owns the message
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: user.id,
        isDeleted: false,
      },
    });

    if (!existingMessage) {
      throw new Error(
        "Message not found or you do not have permission to update it"
      );
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        ...(data.content && { content: data.content }),
        ...(data.messageType && { messageType: data.messageType }),
        ...(data.screenshotUrl && { screenshotUrl: data.screenshotUrl }),
        ...(data.ocrText && { ocrText: data.ocrText }),
        ...(data.ocrConfidence && { ocrConfidence: data.ocrConfidence }),
        ...(data.platform && { platform: data.platform }),
        updatedAt: new Date(),
      },
    });

    return updatedMessage;
  }

  /**
   * Soft delete a message
   */
  static async deleteMessage(messageId: string): Promise<void> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Verify user owns the message
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: user.id,
        isDeleted: false,
      },
    });

    if (!existingMessage) {
      throw new Error(
        "Message not found or you do not have permission to delete it"
      );
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Get message statistics for the user
   */
  static async getMessageStats(): Promise<{
    totalMessages: number;
    analyzedMessages: number;
    platformBreakdown: { platform: string; count: number }[];
    recentActivity: { date: string; count: number }[];
  }> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const baseWhere = {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
      isDeleted: false,
    };

    const [totalMessages, analyzedMessages, platformData, recentData] =
      await Promise.all([
        // Total messages
        prisma.message.count({ where: baseWhere }),

        // Analyzed messages
        prisma.message.count({
          where: {
            ...baseWhere,
            analysis: { isNot: null },
          },
        }),

        // Platform breakdown
        prisma.message.groupBy({
          by: ["platform"],
          where: baseWhere,
          _count: { platform: true },
        }),

        // Recent activity (last 7 days)
        prisma.message.findMany({
          where: {
            ...baseWhere,
            timestamp: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          select: { timestamp: true },
        }),
      ]);

    // Process recent activity data
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const count = recentData.filter(
        (msg) => msg.timestamp.toISOString().split("T")[0] === dateStr
      ).length;

      return { date: dateStr, count };
    }).reverse();

    return {
      totalMessages,
      analyzedMessages,
      platformBreakdown: platformData.map((p) => ({
        platform: p.platform || "Unknown",
        count: p._count.platform,
      })),
      recentActivity,
    };
  }

  /**
   * Search messages
   */
  static async searchMessages(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ messages: MessageWithAnalysis[]; total: number }> {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const skip = (page - 1) * limit;

    const where = {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
      isDeleted: false,
      AND: {
        OR: [
          { content: { contains: query, mode: "insensitive" as const } },
          { ocrText: { contains: query, mode: "insensitive" as const } },
          { platform: { contains: query, mode: "insensitive" as const } },
        ],
      },
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
        include: {
          analysis: true,
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ]);

    return {
      messages: messages as MessageWithAnalysis[],
      total,
    };
  }
}

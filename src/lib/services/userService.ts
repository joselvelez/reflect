/** @format */

// lib/services/userService.ts
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export interface CreateUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export class UserService {
  /**
   * Create or update user from Clerk webhook/auth
   */
  static async upsertUser(data: CreateUserData) {
    const user = await prisma.user.upsert({
      where: { clerkId: data.clerkId },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      update: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return user;
  }

  /**
   * Get current user from Clerk and ensure they exist in database
   */
  static async getCurrentUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Ensure user exists in our database
    const dbUser = await this.upsertUser({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    });

    return dbUser;
  }

  /**
   * Update user settings
   */
  static async updateUserSettings(
    clerkId: string,
    settings: {
      aiProvider?: string;
      analysisEnabled?: boolean;
    }
  ) {
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        aiProvider: settings.aiProvider,
        analysisEnabled: settings.analysisEnabled,
      },
    });

    return user;
  }

  /**
   * Get user by email (for co-parent connections)
   */
  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return user;
  }

  /**
   * Delete user and all associated data
   */
  static async deleteUser(clerkId: string) {
    // First, soft delete all messages
    await prisma.message.updateMany({
      where: {
        OR: [{ sender: { clerkId } }, { receiver: { clerkId } }],
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Then delete the user
    await prisma.user.delete({
      where: { clerkId },
    });
  }
}

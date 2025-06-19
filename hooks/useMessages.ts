/** @format */

// hooks/useMessages.ts
import { useState, useEffect, useCallback } from "react";
import { MessageType } from "@prisma/client";

export interface Message {
  id: string;
  content: string;
  messageType: MessageType;
  screenshotUrl?: string;
  ocrText?: string;
  platform?: string;
  timestamp: string;
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
  analysis?: {
    toxicityScore?: number;
    manipulationScore?: number;
    emotionalTone?: string;
    sentiment?: string;
    suggestedResponse?: string;
    improvementTips?: string[];
  } | null;
}

export interface CreateMessageData {
  content: string;
  messageType?: MessageType;
  receiverId?: string;
  screenshotUrl?: string;
  ocrText?: string;
  ocrConfidence?: number;
  platform?: string;
  externalId?: string;
  timestamp?: Date;
}

export interface MessageFilters {
  platform?: string;
  messageType?: MessageType;
  dateFrom?: Date;
  dateTo?: Date;
  hasAnalysis?: boolean;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMessages = useCallback(
    async (
      pageNum: number = 1,
      filters?: MessageFilters,
      reset: boolean = false
    ) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
        });

        if (filters?.platform) params.append("platform", filters.platform);
        if (filters?.messageType)
          params.append("messageType", filters.messageType);
        if (filters?.dateFrom)
          params.append("dateFrom", filters.dateFrom.toISOString());
        if (filters?.dateTo)
          params.append("dateTo", filters.dateTo.toISOString());
        if (filters?.hasAnalysis !== undefined)
          params.append("hasAnalysis", filters.hasAnalysis.toString());

        const response = await fetch(`/api/messages?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        if (reset || pageNum === 1) {
          setMessages(data.messages);
        } else {
          setMessages((prev) => [...prev, ...data.messages]);
        }

        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createMessage = useCallback(
    async (data: CreateMessageData): Promise<Message | null> => {
      try {
        setError(null);

        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create message");
        }

        const result = await response.json();

        // Add new message to the beginning of the list
        setMessages((prev) => [result.message, ...prev]);
        setTotal((prev) => prev + 1);

        return result.message;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create message"
        );
        return null;
      }
    },
    []
  );

  const updateMessage = useCallback(
    async (
      messageId: string,
      data: Partial<CreateMessageData>
    ): Promise<Message | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/messages/${messageId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update message");
        }

        const result = await response.json();

        // Update message in the list
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? result.message : msg))
        );

        return result.message;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update message"
        );
        return null;
      }
    },
    []
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/messages/${messageId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete message");
        }

        // Remove message from the list
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setTotal((prev) => prev - 1);

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete message"
        );
        return false;
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchMessages(page + 1);
    }
  }, [hasMore, loading, page, fetchMessages]);

  const refresh = useCallback(
    (filters?: MessageFilters) => {
      fetchMessages(1, filters, true);
    },
    [fetchMessages]
  );

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    hasMore,
    total,
    page,
    createMessage,
    updateMessage,
    deleteMessage,
    loadMore,
    refresh,
  };
}

export function useMessageSearch() {
  const [results, setResults] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const search = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/messages/search?${params}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      if (page === 1) {
        setResults(data.messages);
      } else {
        setResults((prev) => [...prev, ...data.messages]);
      }

      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setTotal(0);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    total,
    search,
    clearSearch,
  };
}

export function useMessageStats() {
  const [stats, setStats] = useState<{
    totalMessages: number;
    analyzedMessages: number;
    platformBreakdown: { platform: string; count: number }[];
    recentActivity: { date: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/messages/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}

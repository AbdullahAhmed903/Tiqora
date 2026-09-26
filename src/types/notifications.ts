export type NotificationCategory = "all" | "tickets" | "matches" | "offers" | "security";

export type NotificationPriority = "high" | "normal" | "low";

export interface NotificationItem {
  id: string;
  type: "tickets" | "matches" | "offers" | "security";
  title: string;
  message: string;
  timestamp: string; // ISO string
  timeAgo: string;
  read: boolean;
  priority?: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  meta?: {
    venue?: string;
    eventDate?: string;
    seat?: string;
    orderId?: string;
    tag?: string;
  };
}

export interface NotificationFilterOptions {
  category: NotificationCategory;
  unreadOnly: boolean;
  searchQuery: string;
}

export interface NotificationPreferenceSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: "matches" | "tickets" | "promos" | "security";
}

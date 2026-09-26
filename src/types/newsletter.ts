export type NewsletterStatus = "active" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterStatus;
  source: string;
  ip_hash?: string | null;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  updated_at: string;
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  code?: "SUCCESS" | "ALREADY_SUBSCRIBED" | "REACTIVATED" | "RATE_LIMITED" | "INVALID_INPUT" | "ERROR";
}

export interface GetSubscribersParams {
  page?: number;
  limit?: number;
  status?: "all" | NewsletterStatus;
  search?: string;
}

export interface PaginatedSubscribersResult {
  subscribers: NewsletterSubscriber[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface WindowRecord {
  currentCount: number;
  previousCount: number;
  currentWindowStart: number;
  lastAccess: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

class InMemorySlidingWindowLimiter {
  private store = new Map<string, WindowRecord>();
  private readonly cleanupIntervalMs = 5 * 60 * 1000; // 5 minutes
  private lastPruned = Date.now();

  /**
   * Check and consume rate limit for a specific identifier
   * @param key Unique identifier (e.g., "ip:192.168.1.1" or "endpoint:newsletter")
   * @param maxRequests Maximum allowed requests per window
   * @param windowMs Window duration in milliseconds (e.g., 600,000 for 10 minutes)
   */
  public check(key: string, maxRequests: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    this.maybePrune(now, windowMs);

    let record = this.store.get(key);

    if (!record) {
      record = {
        currentCount: 1,
        previousCount: 0,
        currentWindowStart: now,
        lastAccess: now,
      };
      this.store.set(key, record);
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetMs: windowMs,
      };
    }

    record.lastAccess = now;

    // Check if current window has expired
    const timeSinceWindowStart = now - record.currentWindowStart;

    if (timeSinceWindowStart >= windowMs * 2) {
      // Both current and previous windows have completely expired
      record.previousCount = 0;
      record.currentCount = 1;
      record.currentWindowStart = now;
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetMs: windowMs,
      };
    } else if (timeSinceWindowStart >= windowMs) {
      // Shift current to previous window
      record.previousCount = record.currentCount;
      record.currentCount = 1;
      record.currentWindowStart = record.currentWindowStart + windowMs;
    } else {
      // Still in current window - increment count
      record.currentCount += 1;
    }

    // Calculate weighted estimate for sliding window counter
    const timeInCurrentWindow = now - record.currentWindowStart;
    const weight = Math.max(0, Math.min(1, timeInCurrentWindow / windowMs));
    const estimatedCount = record.currentCount + record.previousCount * (1 - weight);

    const remaining = Math.max(0, Math.floor(maxRequests - estimatedCount));
    const allowed = estimatedCount <= maxRequests;
    const resetMs = Math.max(0, windowMs - timeInCurrentWindow);

    return { allowed, remaining, resetMs };
  }

  /**
   * Prune expired entries to maintain a small memory footprint
   */
  private maybePrune(now: number, windowMs: number) {
    if (now - this.lastPruned < this.cleanupIntervalMs) {
      return;
    }

    const expiryThreshold = now - windowMs * 2;
    for (const [key, record] of this.store.entries()) {
      if (record.lastAccess < expiryThreshold) {
        this.store.delete(key);
      }
    }
    this.lastPruned = now;
  }
}

// Global singleton instance for single-server execution
export const rateLimiter = new InMemorySlidingWindowLimiter();

/**
 * Safely extracts client IP address from Next.js incoming request headers
 */
export function getClientIp(headers: Headers): string {
  // Cloudflare header
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // Standard proxy forwarded header
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0];
    if (firstIp) return firstIp.trim();
  }

  // Nginx / real IP header
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "127.0.0.1";
}

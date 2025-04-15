// Rate limiter to control how many riddles can be generated per day

// Store IP addresses and their riddle generation counts
interface RateLimitRecord {
  count: number;
  lastReset: Date; // When we last reset the counter
}

class RateLimiter {
  private readonly limits: Map<string, RateLimitRecord>;
  private readonly maxRequestsPerDay: number;

  constructor(maxRequestsPerDay: number = 10) {
    this.limits = new Map<string, RateLimitRecord>();
    this.maxRequestsPerDay = maxRequestsPerDay;
  }

  /**
   * Check if an IP has exceeded its daily limit
   * @param ip The IP address to check
   * @returns true if the IP can generate more riddles, false if they've hit the limit
   */
  public canGenerate(ip: string): boolean {
    const now = new Date();
    const record = this.getOrCreateRecord(ip, now);
    
    // Check if we need to reset the counter (new day)
    if (this.isNewDay(record.lastReset, now)) {
      record.count = 0;
      record.lastReset = now;
    }
    
    return record.count < this.maxRequestsPerDay;
  }

  /**
   * Increment the count for an IP address
   * @param ip The IP address
   * @returns The number of remaining requests
   */
  public increment(ip: string): number {
    const now = new Date();
    const record = this.getOrCreateRecord(ip, now);
    
    // Check if we need to reset the counter (new day)
    if (this.isNewDay(record.lastReset, now)) {
      record.count = 0;
      record.lastReset = now;
    }
    
    record.count += 1;
    
    const remaining = Math.max(0, this.maxRequestsPerDay - record.count);
    return remaining;
  }

  /**
   * Get remaining requests for an IP
   * @param ip The IP address
   * @returns Number of remaining requests for the day
   */
  public getRemainingRequests(ip: string): number {
    const now = new Date();
    const record = this.getOrCreateRecord(ip, now);
    
    // Check if we need to reset the counter (new day)
    if (this.isNewDay(record.lastReset, now)) {
      record.count = 0;
      record.lastReset = now;
      return this.maxRequestsPerDay;
    }
    
    return Math.max(0, this.maxRequestsPerDay - record.count);
  }

  /**
   * Get or create a rate limit record for an IP
   */
  private getOrCreateRecord(ip: string, now: Date): RateLimitRecord {
    if (!this.limits.has(ip)) {
      this.limits.set(ip, {
        count: 0,
        lastReset: now
      });
    }
    
    return this.limits.get(ip)!;
  }

  /**
   * Check if it's a new day compared to the last reset
   */
  private isNewDay(lastReset: Date, now: Date): boolean {
    return (
      lastReset.getFullYear() !== now.getFullYear() ||
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getDate() !== now.getDate()
    );
  }
}

// Create a singleton instance with 10 requests per day limit
export const rateLimiter = new RateLimiter(10);
import { 
  users, type User, type InsertUser,
  riddles, type Riddle, type InsertRiddle 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Riddle storage methods
  getRiddles(limit?: number, offset?: number): Promise<Riddle[]>;
  getRiddleById(id: number): Promise<Riddle | undefined>;
  getLatestRiddle(): Promise<Riddle | undefined>;
  countRiddles(): Promise<number>;
  createRiddle(riddle: InsertRiddle): Promise<Riddle>;
  updateRiddle(id: number, updates: Partial<Omit<Riddle, "id">>): Promise<Riddle | undefined>;
  rateRiddle(id: number, rating: number): Promise<Riddle | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getRiddles(limit = 100, offset = 0): Promise<Riddle[]> {
    return db.select()
      .from(riddles)
      .orderBy(desc(riddles.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRiddleById(id: number): Promise<Riddle | undefined> {
    const [riddle] = await db.select().from(riddles).where(eq(riddles.id, id));
    return riddle || undefined;
  }

  async getLatestRiddle(): Promise<Riddle | undefined> {
    const [riddle] = await db.select()
      .from(riddles)
      .where(eq(riddles.isLatest, true))
      .limit(1);
    
    return riddle || undefined;
  }

  async countRiddles(): Promise<number> {
    const result = await db.select().from(riddles);
    return result.length;
  }

  async createRiddle(insertRiddle: InsertRiddle): Promise<Riddle> {
    // If this is the latest riddle, update all other riddles to not be latest
    if (insertRiddle.isLatest) {
      await db.update(riddles)
        .set({ isLatest: false })
        .where(eq(riddles.isLatest, true));
    }
    
    const [riddle] = await db.insert(riddles)
      .values(insertRiddle)
      .returning();
    
    return riddle;
  }

  async updateRiddle(id: number, updates: Partial<Omit<Riddle, "id">>): Promise<Riddle | undefined> {
    // If we're setting this as latest, update all others
    if (updates.isLatest) {
      await db.update(riddles)
        .set({ isLatest: false })
        .where(eq(riddles.isLatest, true));
    }
    
    const [riddle] = await db.update(riddles)
      .set(updates)
      .where(eq(riddles.id, id))
      .returning();
    
    return riddle || undefined;
  }

  async rateRiddle(id: number, rating: number): Promise<Riddle | undefined> {
    // Get current riddle to update rating
    const currentRiddle = await this.getRiddleById(id);
    if (!currentRiddle) {
      return undefined;
    }

    // Calculate new values
    const newRatingCount = currentRiddle.ratingCount + 1;
    const newRatingSum = currentRiddle.ratingSum + rating;
    const newAverageRating = newRatingSum / newRatingCount;

    // Update the riddle with new rating values
    const [updatedRiddle] = await db.update(riddles)
      .set({
        ratingCount: newRatingCount,
        ratingSum: newRatingSum,
        averageRating: newAverageRating
      })
      .where(eq(riddles.id, id))
      .returning();
    
    return updatedRiddle || undefined;
  }
}

export const storage = new DatabaseStorage();

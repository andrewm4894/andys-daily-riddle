import { 
  users, type User, type InsertUser,
  riddles, type Riddle, type InsertRiddle 
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private riddlesMap: Map<number, Riddle>;
  currentUserId: number;
  currentRiddleId: number;

  constructor() {
    this.users = new Map();
    this.riddlesMap = new Map();
    this.currentUserId = 1;
    this.currentRiddleId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Riddle implementations
  async getRiddles(limit = 100, offset = 0): Promise<Riddle[]> {
    return Array.from(this.riddlesMap.values())
      .sort((a, b) => {
        // Sort by creation date descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(offset, offset + limit);
  }

  async getRiddleById(id: number): Promise<Riddle | undefined> {
    return this.riddlesMap.get(id);
  }

  async getLatestRiddle(): Promise<Riddle | undefined> {
    return Array.from(this.riddlesMap.values()).find(
      (riddle) => riddle.isLatest === true
    );
  }

  async countRiddles(): Promise<number> {
    return this.riddlesMap.size;
  }

  async createRiddle(insertRiddle: InsertRiddle): Promise<Riddle> {
    // If this is a new "latest" riddle, update all existing latest to false
    if (insertRiddle.isLatest) {
      for (const [id, riddle] of this.riddlesMap.entries()) {
        if (riddle.isLatest) {
          this.riddlesMap.set(id, { ...riddle, isLatest: false });
        }
      }
    }

    const id = this.currentRiddleId++;
    const now = new Date();
    const riddle: Riddle = { 
      ...insertRiddle, 
      id, 
      createdAt: now
    };
    
    this.riddlesMap.set(id, riddle);
    return riddle;
  }

  async updateRiddle(id: number, updates: Partial<Omit<Riddle, "id">>): Promise<Riddle | undefined> {
    const existingRiddle = this.riddlesMap.get(id);
    
    if (!existingRiddle) {
      return undefined;
    }

    // If we're setting this as latest, update all others
    if (updates.isLatest) {
      for (const [riddleId, riddle] of this.riddlesMap.entries()) {
        if (riddleId !== id && riddle.isLatest) {
          this.riddlesMap.set(riddleId, { ...riddle, isLatest: false });
        }
      }
    }

    const updatedRiddle = { ...existingRiddle, ...updates };
    this.riddlesMap.set(id, updatedRiddle);
    
    return updatedRiddle;
  }
}

export const storage = new MemStorage();

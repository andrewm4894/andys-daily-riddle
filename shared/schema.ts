import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Riddle schema
export const riddles = pgTable("riddles", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isLatest: boolean("is_latest").default(true).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  ratingSum: integer("rating_sum").default(0).notNull(),
  averageRating: real("average_rating").default(0),
});

export const insertRiddleSchema = createInsertSchema(riddles).pick({
  question: true,
  answer: true,
  isLatest: true,
});

export type InsertRiddle = z.infer<typeof insertRiddleSchema>;
export type Riddle = typeof riddles.$inferSelect;

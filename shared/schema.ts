import { pgTable, text, serial, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
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

export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  rate: real("rate").notNull(),
  source: text("source").notNull(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  targetRate: real("target_rate").notNull(),
  isAbove: boolean("is_above").notNull(),
  created: timestamp("created").notNull().defaultNow(),
  triggered: boolean("triggered").notNull().default(false),
});

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  vote: text("vote").notNull(), // "yes", "neutral", "no"
  created: timestamp("created").notNull().defaultNow(),
});

// Rate suggestion types
export const SuggestionType = z.enum(["good", "neutral", "bad"]);
export type SuggestionType = z.infer<typeof SuggestionType>;

// Alert schema
export const insertAlertSchema = createInsertSchema(alerts).pick({
  email: true,
  targetRate: true,
  isAbove: true,
});

// Poll schema
export const insertPollSchema = createInsertSchema(polls).pick({
  vote: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Poll = typeof polls.$inferSelect;

// Exchange rate forecast type
export interface ForecastPoint {
  date: string;
  rate: number;
  confidence: [number, number]; // [lower, upper]
}

// Exchange rate history type
export interface RateHistory {
  date: string;
  rate: number;
}

// Poll summary type
export interface PollSummary {
  yes: { count: number, percentage: number };
  neutral: { count: number, percentage: number };
  no: { count: number, percentage: number };
  total: number;
}

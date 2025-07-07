import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  anonymousId: text("anonymous_id"),
  mobileNumber: text("mobile_number"),
  loginData: json("login_data"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const cachedUrls = pgTable("cached_urls", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull().unique(),
  url: text("url").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertCachedUrlSchema = createInsertSchema(cachedUrls).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type CachedUrl = typeof cachedUrls.$inferSelect;
export type InsertCachedUrl = z.infer<typeof insertCachedUrlSchema>;

// API request/response schemas
export const sendOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
});

export const verifyOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  otp: z.string().regex(/^\d{4,6}$/, "Invalid OTP"),
});

export const loginStatusSchema = z.object({
  isLoggedIn: z.boolean(),
  playlistUrl: z.string().optional(),
});

export type SendOtpRequest = z.infer<typeof sendOtpSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpSchema>;
export type LoginStatus = z.infer<typeof loginStatusSchema>;

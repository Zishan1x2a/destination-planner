import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blessingsTable = pgTable("blessings", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlessingSchema = createInsertSchema(blessingsTable).omit({ id: true, createdAt: true });
export type InsertBlessing = z.infer<typeof insertBlessingSchema>;
export type Blessing = typeof blessingsTable.$inferSelect;

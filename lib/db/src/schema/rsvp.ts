import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rsvpTable = pgTable("rsvp", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  numberOfGuests: integer("number_of_guests").default(1),
  attendanceStatus: text("attendance_status").notNull(),
  needsTravelHelp: boolean("needs_travel_help").default(false),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRsvpSchema = createInsertSchema(rsvpTable).omit({ id: true, createdAt: true });
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvpTable.$inferSelect;

import { pgTable, serial, text, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const consultantsTable = pgTable("consultants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  longBio: text("long_bio"),
  avatarUrl: text("avatar_url"),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  yearsExperience: integer("years_experience").notNull().default(0),
  serviceCount: integer("service_count").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  specializations: jsonb("specializations").$type<string[]>().notNull().default([]),
  languages: jsonb("languages").$type<string[]>().notNull().default([]),
  education: jsonb("education").$type<string[]>().notNull().default([]),
});

export const insertConsultantSchema = createInsertSchema(consultantsTable).omit({ id: true });
export type InsertConsultant = z.infer<typeof insertConsultantSchema>;
export type Consultant = typeof consultantsTable.$inferSelect;

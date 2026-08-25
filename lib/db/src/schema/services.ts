import { pgTable, serial, text, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  price: real("price").notNull(),
  duration: text("duration").notNull(),
  categoryId: integer("category_id").notNull(),
  consultantId: integer("consultant_id").notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
  faqs: jsonb("faqs").$type<Array<{ question: string; answer: string }>>().notNull().default([]),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;

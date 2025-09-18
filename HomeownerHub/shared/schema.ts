import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const models = pgTable("models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  userId: varchar("user_id").references(() => users.id),
});

export const audits = pgTable("audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").references(() => models.id),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  fairnessScore: real("fairness_score"),
  userId: varchar("user_id").references(() => users.id),
});

export const fairnessMetrics = pgTable("fairness_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditId: varchar("audit_id").references(() => audits.id),
  demographicParity: real("demographic_parity"),
  equalOpportunity: real("equal_opportunity"),
  calibration: real("calibration"),
  accuracy: real("accuracy"),
  precision: real("precision"),
  recall: real("recall"),
  f1Score: real("f1_score"),
  confusionMatrix: jsonb("confusion_matrix"), // {tn, fp, fn, tp}
  groupMetrics: jsonb("group_metrics"), // metrics by demographic group
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditId: varchar("audit_id").references(() => audits.id),
  title: text("title").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  pdfUrl: text("pdf_url"),
  userId: varchar("user_id").references(() => users.id),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").references(() => models.id),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processed: boolean("processed").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertModelSchema = createInsertSchema(models).pick({
  name: true,
  description: true,
});

export const insertAuditSchema = createInsertSchema(audits).pick({
  modelId: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  auditId: true,
  title: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).pick({
  modelId: true,
  filename: true,
  size: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = z.infer<typeof insertAuditSchema>;

export type FairnessMetrics = typeof fairnessMetrics.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;

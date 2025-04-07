import { int, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Users table
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Student profiles table
export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  age: int("age"),
  disabilityType: varchar("disability_type", { length: 50 }),
  grade: varchar("grade", { length: 20 }),
  language: varchar("language", { length: 50 }).default("english"),
  certificateUrl: varchar("certificate_url", { length: 255 }),
  certificateVerified: int("certificate_verified").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Learning assessments table
export const learningAssessments = mysqlTable("learning_assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: varchar("question_id", { length: 50 }).notNull(),
  answer: varchar("answer", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning preferences derived from assessments
export const learningPreferences = mysqlTable("learning_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  learningStyle: varchar("learning_style", { length: 50 }),
  fontPreference: varchar("font_preference", { length: 50 }),
  focusDuration: varchar("focus_duration", { length: 50 }),
  conceptUnderstanding: varchar("concept_understanding", { length: 50 }),
  environmentPreference: varchar("environment_preference", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Sessions table for authentication
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
});
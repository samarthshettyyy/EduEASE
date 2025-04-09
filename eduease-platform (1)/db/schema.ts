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

// Classrooms table
export const classrooms = mysqlTable("classrooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 100 }),
  teacherId: int("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roomCode: varchar("room_code", { length: 10 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Classroom students junction table
export const classroomStudents = mysqlTable("classroom_students", {
  id: int("id").autoincrement(), // Removed primaryKey()
  classroomId: int("classroom_id").notNull().references(() => classrooms.id, { onDelete: "cascade" }),
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow(),
},
(table) => {
  return {
    classroomStudentIdx: primaryKey({ columns: [table.classroomId, table.studentId] }),
  };
});

// Documents table
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 2048 }).notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: int("file_size").notNull(),
  teacherId: int("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  classroomId: int("classroom_id").notNull().references(() => classrooms.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Student documents junction table with tracking
export const studentDocuments = mysqlTable("student_documents", {
  id: int("id").autoincrement(), // Removed primaryKey()
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentId: int("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  viewed: int("viewed").default(0), // Using int as boolean (0/1)
  completed: int("completed").default(0), // Using int as boolean (0/1)
  firstViewedAt: timestamp("first_viewed_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
},
(table) => {
  return {
    studentDocumentIdx: primaryKey({ columns: [table.studentId, table.documentId] }),
  };
});
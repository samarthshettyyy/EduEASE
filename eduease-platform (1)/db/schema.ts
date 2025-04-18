import { int, mysqlTable, primaryKey, text, timestamp, varchar, json, float,serial, enum as dbEnum } from "drizzle-orm/mysql-core";

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

// User accessibility preferences
export const accessibilityPreferences = mysqlTable("accessibility_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  textToSpeechEnabled: int("text_to_speech_enabled").default(1),
  emotionDetectionEnabled: int("emotion_detection_enabled").default(0),
  voiceNavigationEnabled: int("voice_navigation_enabled").default(0),
  signLanguageEnabled: int("sign_language_enabled").default(0),
  preferredVoice: varchar("preferred_voice", { length: 100 }).default("Microsoft David - English (United States) (en-US)"),
  readingSpeed: float("reading_speed").default(1.0),
  pitch: float("pitch").default(1.0),
  volume: float("volume").default(1.0),
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
  classroomId: int("classroom_id").notNull().references(() => classrooms.id, { onDelete: "cascade" }),
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow(),
},
(table) => {
  return {
    classroomStudentIdx: primaryKey({ columns: [table.classroomId, table.studentId] }),
  };
});

// Modules table (updated with more details)
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  classroomId: int("classroom_id").notNull().references(() => classrooms.id, { onDelete: "cascade" }),
  
  // New fields to match your route.ts requirements
  status: varchar("status", { length: 50 }).default("draft"),
  studentProgress: float("student_progress").default(0),
  dueDate: timestamp("due_date"),
  chapters: int("chapters").default(0),
  quizzes: int("quizzes").default(0),
  isLocked: int("is_locked").default(0),
  prerequisites: json("prerequisites"), // JSON array of prerequisite module IDs
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Module Content (PDF, documents, text)
export const moduleContent = mysqlTable("module_content", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // pdf, docx, txt, html
  filePath: varchar("file_path", { length: 2048 }),
  textContent: text("text_content"),
  sentenceCount: int("sentence_count").default(0),
  wordCount: int("word_count").default(0),
  characterCount: int("character_count").default(0),
  uploadedBy: int("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Module Interactive elements
export const moduleInteractive = mysqlTable("module_interactive", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(), // drag-and-drop, fill-in-blanks, matching, simulation
  contentPath: varchar("content_path", { length: 2048 }),
  configData: json("config_data"), // JSON configuration for the interactive element
  estimatedCompletionTime: int("estimated_completion_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Module 3D Models
export const module3DModels = mysqlTable("module_3d_models", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  modelPath: varchar("model_path", { length: 2048 }).notNull(),
  thumbnailPath: varchar("thumbnail_path", { length: 2048 }),
  format: varchar("format", { length: 20 }).notNull(), // gltf, obj, fbx, usdz
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Module Quizzes
export const moduleQuizzes = mysqlTable("module_quizzes", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  timeLimit: int("time_limit"), // in minutes, null for no limit
  passingScore: int("passing_score").default(70), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Quiz Questions
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quiz_id").notNull().references(() => moduleQuizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(), // multiple-choice, true-false, short-answer, matching
  options: json("options"), // JSON array of options for multiple choice questions
  correctAnswer: json("correct_answer").notNull(), // JSON for flexibility in answer types
  points: int("points").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// User Quiz Attempts
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quiz_id").notNull().references(() => moduleQuizzes.id, { onDelete: "cascade" }),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: float("score").notNull(),
  timeTaken: int("time_taken"), // in seconds
  completed: int("completed").default(1),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// User Quiz Question Responses
export const quizResponses = mysqlTable("quiz_responses", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attempt_id").notNull().references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: int("question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  userAnswer: json("user_answer").notNull(),
  isCorrect: int("is_correct").default(0),
  pointsAwarded: float("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Module Progress
export const moduleProgress = mysqlTable("module_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: int("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  contentCompleted: int("content_completed").default(0),
  interactiveCompleted: int("interactive_completed").default(0),
  models3DViewed: int("models_3d_viewed").default(0),
  quizCompleted: int("quiz_completed").default(0),
  quizScore: float("quiz_score"),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Documents table (existing)
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

// Student documents junction table with tracking (existing)
export const studentDocuments = mysqlTable("student_documents", {
  id: int("id").autoincrement(),
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentId: int("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  viewed: int("viewed").default(0),
  completed: int("completed").default(0),
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

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  classroomId: int("classroom_id").notNull(),
  userId: int("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const classroomContents = mysqlTable('classroom_contents', {
  id: serial('id').primaryKey(),
  chapterId: varchar('chapter_id', { length: 255 }),
  title: varchar('title', { length: 255 }),
  standardContent: text('standard_content'),
  simplifiedContent: text('simplified_content'),
  detailedContent: text('detailed_content'),
  importantWords: json('important_words'),
  quiz: json('quiz'),
  settings: json('settings'),
})
// Add these to your schema.ts file

export const mediaFiles = mysqlTable('media_files', {
  id: serial('id').primaryKey(),
  chapterId: varchar('chapter_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: varchar('url', { length: 2083 }).notNull(), // standard max URL length

  createdAt: timestamp('created_at').defaultNow()
});

export const chapterContent = mysqlTable('chapter_content', {
  id: serial('id').primaryKey(),
  chapterId: varchar('chapter_id',{ length: 20 }).notNull().unique(),
  title: varchar('title',{ length: 50 }).notNull(),
  standardContent: text('standard_content'),
  simplifiedContent: text('simplified_content'),
  detailedContent: text('detailed_content'),
  importantWords: text('important_words'), // Stored as JSON string
  quizQuestions: text('quiz_questions'), // Stored as JSON string
  images: text('images'), // Stored as JSON string
  settings: text('settings'), // Stored as JSON string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
// 3D Model type
export interface Model3DType {
  id: string | number;
  title: string;
  description: string;
  modelPath: string;
  thumbnailPath?: string;
  format: string;
}

// Interactive point for 3D models
export interface InteractivePoint {
  id: string | number;
  modelId: string | number;
  title: string;
  description: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}
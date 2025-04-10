import { db } from "@/db";
import { users, studentProfiles, sessions, learningAssessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { learningPreferences, } from "../db/schema";

export async function register(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  age?: string;
  disabilityType?: string;
  grade?: string;
  language?: string;
}) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Begin a transaction
  const transaction = await db.transaction(async (tx) => {
    // Create user - without using returning()
    const result = await tx
      .insert(users)
      .values({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

    // Get the newly created user ID (alternative approach)
    const newUser = await tx.query.users.findFirst({
      where: eq(users.email, userData.email),
    });

    // If it's a student, create student profile
    if (userData.role === "student" && newUser) {
      await tx.insert(studentProfiles).values({
        userId: newUser.id,
        age: userData.age ? parseInt(userData.age) : null,
        disabilityType: userData.disabilityType,
        grade: userData.grade,
        language: userData.language,
      });
    }

    return newUser;
  });

  return transaction;
}
export async function login(email: string, password: string) {
  // Find user by email
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return null;
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
export async function saveAssessment(userId: number, assessmentData: Record<string, string>) {
  // Insert assessment answers
  const assessmentEntries = Object.entries(assessmentData).map(([questionId, answer]) => ({
    userId,
    questionId,
    answer,
  }));

  await db.insert(learningAssessments).values(assessmentEntries);

  // Analyze and store learning preferences based on answers
  // This is a simplistic approach - in a real app you'd have more sophisticated mapping
  const preferences: Record<string, string> = {};

  // Map q1 answer to learning style
  if (assessmentData.q1 === "a") preferences.learningStyle = "visual_text";
  else if (assessmentData.q1 === "b") preferences.learningStyle = "auditory";
  else if (assessmentData.q1 === "c") preferences.learningStyle = "visual_video";
  else if (assessmentData.q1 === "d") preferences.learningStyle = "kinesthetic";

  // Map q2 answer to font preference
  if (assessmentData.q2 === "a") preferences.fontPreference = "serif";
  else if (assessmentData.q2 === "b") preferences.fontPreference = "sans_serif";
  else if (assessmentData.q2 === "c") preferences.fontPreference = "dyslexia_friendly";
  else if (assessmentData.q2 === "d") preferences.fontPreference = "large_text";

  // Map q3 answer to focus duration
  if (assessmentData.q3 === "a") preferences.focusDuration = "very_short";
  else if (assessmentData.q3 === "b") preferences.focusDuration = "short";
  else if (assessmentData.q3 === "c") preferences.focusDuration = "medium";
  else if (assessmentData.q3 === "d") preferences.focusDuration = "long";

  // Save preferences to database
  await db.insert(learningPreferences).values({
    userId,
    ...preferences,
  });

  return true;
}

export async function saveCertificate(userId: number, certificateUrl: string) {
  await db
    .update(studentProfiles)
    .set({
      certificateUrl,
      certificateVerified: 0, // Not verified yet
    })
    .where(eq(studentProfiles.userId, userId));

  return true;
}
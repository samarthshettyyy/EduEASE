// app/api/messages/route.ts
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const classroomId = url.searchParams.get("classroomId");

  if (!classroomId) {
    return NextResponse.json({ error: "Missing classroomId" }, { status: 400 });
  }

  const result = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderName: users.name,
    })
    .from(messages)
    .innerJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.classroomId, Number(classroomId)))
    .orderBy(messages.createdAt);

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { classroomId, userId, content } = await req.json();

  if (!classroomId || !userId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const inserted = await db
    .insert(messages)
    .values({
      classroomId,
      userId,
      content,
    });

  return NextResponse.json({ success: true });
}

// app/api/classrooms-with-teachers/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { classrooms, users } from "@/db/schema";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const classroomId = url.searchParams.get("id");

    if (!classroomId) {
      return NextResponse.json({ error: "Missing classroom ID" }, { status: 400 });
    }

    const result = await db.execute(
      sql`
        SELECT 
          c.id, 
          c.name, 
          c.description, 
          c.subject, 
          c.room_code, 
          c.created_at,
          u.name AS teacher_name
        FROM ${classrooms} c
        JOIN ${users} u ON c.teacher_id = u.id
        WHERE c.id = ${Number(classroomId)};
      `
    );

    return NextResponse.json({ classroom: result[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

// app/api/classrooms/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db' // your MySQL client setup
import { classrooms } from '@/db/schema' // your schema location
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.warn(body);
    const { name, description, subject, teacher_id, grade } = body

    if (!name || !teacher_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const roomCode = nanoid(8) // or any other logic to generate room codes

    const [inserted] = await db
      .insert(classrooms)
      .values({
        name,
        description,
        subject,
        teacherId: teacher_id,
        roomCode,
      })

    return NextResponse.json({ classroom: inserted }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

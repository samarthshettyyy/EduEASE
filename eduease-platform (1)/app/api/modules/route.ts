// app/api/modules/route.ts

import { db } from "@/db"
import { modules, type Module } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allModules = await db.select().from(modules)
    
    // Convert isLocked from int to boolean for frontend
    const formattedModules = allModules.map(module => ({
      ...module,
      isLocked: Boolean(module.isLocked)
    }))
    
    return Response.json(formattedModules)
  } catch (err) {
    return new Response("Failed to fetch modules", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.name || !body.classroomId) {
      return new Response("Missing required fields: name and classroomId are required", { 
        status: 400 
      })
    }

    // Create a new module with fields that match the updated schema
    const newModule = {
      name: body.name,
      description: body.description || null,
      classroomId: body.classroomId,
      status: body.status || "draft",
      studentProgress: body.studentProgress ?? 0,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      chapters: body.chapters ?? 0,
      quizzes: body.quizzes ?? 0,
      isLocked: body.isLocked ? 1 : 0, // Convert boolean to int for MySQL
      prerequisites: body.prerequisites || [],
      // The fields createdAt and updatedAt will be automatically set
    }

    // Insert the new module
    const result = await db.insert(modules).values(newModule)
    
    // Get the inserted ID from the MySQL result
    // This is the correct way to access the insertId from a MySQL result in Drizzle
    const insertId = result[0]?.insertId
    
    if (!insertId) {
      throw new Error("Failed to get insertId after module creation")
    }
    
    // Fetch the newly created module
    const [createdModule] = await db.select().from(modules).where(
      eq(modules.id, insertId)
    )
    
    if (!createdModule) {
      throw new Error("Failed to fetch the newly created module")
    }
    
    // Return the created module with boolean conversion for isLocked
    return Response.json({
      ...createdModule,
      isLocked: Boolean(createdModule.isLocked)
    })
  } catch (err) {
    console.error("Error creating module:", err)
    return new Response(`Failed to create module: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
      status: 500 
    })
  }
}
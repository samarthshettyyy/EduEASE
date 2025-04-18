// app/api/modules/[id]/route.ts

import { db } from "@/db"
import { modules } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const [mod] = await db.select().from(modules).where(eq(modules.id, params.id))
    if (!mod) return new Response("Module not found", { status: 404 })
    
    // Convert isLocked from int to boolean for frontend
    return Response.json({
      ...mod,
      isLocked: Boolean(mod.isLocked)
    })
  } catch (err) {
    return new Response("Failed to fetch module", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    
    // Prepare data for database update
    const updateData = { ...body }
    
    // Convert boolean isLocked to int for MySQL if it exists in the body
    if (typeof updateData.isLocked === 'boolean') {
      updateData.isLocked = updateData.isLocked ? 1 : 0
    }
    
    // Set the updatedAt field to current timestamp
    updateData.updatedAt = new Date()

    // Update the module
    await db.update(modules).set(updateData).where(eq(modules.id, params.id))
    
    // Fetch the updated module
    const [updated] = await db.select().from(modules).where(eq(modules.id, params.id))
    
    if (!updated) {
      return new Response("Module not found after update", { status: 404 })
    }
    
    // Convert isLocked back to boolean for frontend
    return Response.json({
      ...updated,
      isLocked: Boolean(updated.isLocked)
    })
  } catch (err) {
    console.error("Error updating module:", err)
    return new Response(`Failed to update module: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
      status: 500 
    })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify the module exists before deletion
    const [moduleToDelete] = await db.select().from(modules).where(eq(modules.id, params.id))
    
    if (!moduleToDelete) {
      return new Response("Module not found", { status: 404 })
    }
    
    // Delete the module
    await db.delete(modules).where(eq(modules.id, params.id))
    
    return Response.json({ 
      success: true,
      message: "Module deleted successfully"
    })
  } catch (err) {
    console.error("Error deleting module:", err)
    return new Response(`Failed to delete module: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
      status: 500 
    })
  }
}
import { saveCertificate, getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    
    // First try to get user from session, fall back to userId from form data
    let user = await getCurrentUser();
    
    if (!user && userId) {
      // Use userId from form data if session is not available
      user = { id: parseInt(userId) };
    }
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized - No user found" },
        { status: 401 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
    
    // Get file extension
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Save file to uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory path - using /tmp for Vercel or similar hosting
    const baseDir = process.env.NODE_ENV === "production" ? "/tmp" : process.cwd();
    const publicDir = join(baseDir, "public");
    const uploadDir = join(publicDir, "uploads");
    
    // Create all directories in the path
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Full path for the file
    const fullPath = join(uploadDir, fileName);
    console.log("Writing file to:", fullPath);
    
    // Save the file
    try {
      await writeFile(fullPath, buffer);
      console.log("File written successfully");
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      throw new Error(`Failed to write file: ${(writeError as Error).message}`);
    }
    
    // Save certificate URL to database
    const certificateUrl = `/uploads/${fileName}`;
    await saveCertificate(user.id, certificateUrl);
    
    return NextResponse.json({
      message: "Certificate uploaded successfully",
      certificateUrl,
    });
  } catch (error) {
    console.error("Certificate upload error:", error);
    return NextResponse.json(
      { 
        message: "An error occurred uploading certificate", 
        error: (error instanceof Error) ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
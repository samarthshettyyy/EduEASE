import { saveAssessment, getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const assessmentData = body.answers;
    
    if (!assessmentData || Object.keys(assessmentData).length === 0) {
      return NextResponse.json(
        { message: "No assessment data provided" },
        { status: 400 }
      );
    }
    
    await saveAssessment(user.id, assessmentData);
    
    return NextResponse.json({
      message: "Assessment saved successfully",
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { message: "An error occurred saving assessment" },
      { status: 500 }
    );
  }
}
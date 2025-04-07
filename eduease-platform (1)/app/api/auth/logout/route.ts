import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logout();
    
    return NextResponse.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
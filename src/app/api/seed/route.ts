import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@src/scripts/seedData";

export async function POST(request: NextRequest) {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error seeding database",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

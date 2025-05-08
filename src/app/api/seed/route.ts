import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@src/scripts/seedData";

export async function POST(request: NextRequest) {
  try {
    console.log("API: Starting database seed process");
    const result = await seedDatabase();
    
    if (result.success) {
      console.log("API: Database seeded successfully");
      return NextResponse.json(result, { status: 200 });
    } else {
      console.error("API: Database seeding failed with error:", result.error);
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("API: Unexpected error during seeding:", error);
    if (error instanceof Error) {
      console.error("API: Error name:", error.name);
      console.error("API: Error message:", error.message);
      console.error("API: Error stack:", error.stack);
    }
    
    return NextResponse.json({
      success: false,
      message: "Error seeding database",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db-utils"

// This endpoint can be used to seed the database with initial data
export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}


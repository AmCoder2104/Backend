import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Question from "@/models/Question"

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const subject = searchParams.get("subject")

  if (!subject) {
    return NextResponse.json({ error: "Subject parameter is required" }, { status: 400 })
  }

  try {
    // Connect to the database
    await dbConnect()

    // Fetch questions for the specified subject
    const questions = await Question.find({ subject }).lean()

    // Transform MongoDB _id to string for JSON serialization
    const serializedQuestions = questions.map((q) => ({
      ...q,
      _id: q._id.toString(),
    }))

    return NextResponse.json(serializedQuestions)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch questions from database" }, { status: 500 })
  }
}


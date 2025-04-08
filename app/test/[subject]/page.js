"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heading } from "@/components/ui/heading"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const subject = params.subject

  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check authentication status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (status !== "authenticated") return

      try {
        setLoading(true)
        setSelectedOption(null) // Reset selection when fetching new questions
        const response = await fetch(`/api/questions?subject=${subject}`)

        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }

        const data = await response.json()
        setQuestions(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load questions. Please try again later.")
        setLoading(false)
      }
    }

    if (session) {
      fetchQuestions()
    }
  }, [subject, session, status])

  const handleOptionSelect = (index) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null) // Reset selection when moving to next question
    } else {
      setShowResults(true)
    }
  }

  const handleReturnHome = () => {
    router.push("/")
  }

  const handleRestartTest = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setScore(0)
    setShowResults(false)
  }

  const formatSubjectTitle = (subjectId) => {
    return subjectId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={handleReturnHome}>Return Home</Button>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Test Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold mb-2">
              {score} / {questions.length}
            </p>
            <p className="text-muted-foreground mb-6">
              You answered {score} out of {questions.length} questions correctly.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReturnHome}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Button>
            <Button onClick={handleRestartTest}>Restart Test</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={handleReturnHome} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <Heading
        title={`${formatSubjectTitle(subject)} Test`}
        description={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        className="mb-6"
      />

      {questions.length > 0 && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestionIndex].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedOption !== null ? selectedOption.toString() : undefined}
              className="space-y-4"
              onValueChange={(value) => handleOptionSelect(Number.parseInt(value, 10))}
            >
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div key={`${currentQuestionIndex}-${index}`} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`question-${currentQuestionIndex}-option-${index}`}
                    checked={selectedOption === index}
                  />
                  <Label
                    htmlFor={`question-${currentQuestionIndex}-option-${index}`}
                    className="cursor-pointer flex-grow"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNextQuestion} disabled={selectedOption === null} className="w-full">
              {currentQuestionIndex === questions.length - 1 ? "Finish Test" : "Next Question"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}


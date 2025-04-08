"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Download, Eye, MoreHorizontal, Search } from "lucide-react"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function ResultsPage() {
  const { data: session } = useSession()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For now, we'll use mock data
    const mockResults = [
      {
        id: 1,
        user: { id: 3, name: "Bob Johnson", email: "bob@example.com" },
        test: { id: 1, title: "Mobile Development Basics", subject: "mobile-development" },
        score: 85,
        totalQuestions: 15,
        correctAnswers: 13,
        startTime: "2023-05-15T10:30:00Z",
        endTime: "2023-05-15T11:00:00Z",
        status: "completed",
        passed: true,
      },
      {
        id: 2,
        user: { id: 4, name: "Alice Brown", email: "alice@example.com" },
        test: { id: 2, title: "Advanced Web Development", subject: "web-development" },
        score: 72,
        totalQuestions: 20,
        correctAnswers: 14,
        startTime: "2023-05-14T14:20:00Z",
        endTime: "2023-05-14T15:05:00Z",
        status: "completed",
        passed: true,
      },
      {
        id: 3,
        user: { id: 5, name: "Charlie Davis", email: "charlie@example.com" },
        test: { id: 3, title: "Graphic Design Principles", subject: "graphic-design" },
        score: 45,
        totalQuestions: 12,
        correctAnswers: 5,
        startTime: "2023-05-13T09:15:00Z",
        endTime: "2023-05-13T09:40:00Z",
        status: "completed",
        passed: false,
      },
      {
        id: 4,
        user: { id: 7, name: "Frank Miller", email: "frank@example.com" },
        test: { id: 4, title: "Video Editing Techniques", subject: "video-editing" },
        score: 90,
        totalQuestions: 18,
        correctAnswers: 16,
        startTime: "2023-05-12T16:45:00Z",
        endTime: "2023-05-12T17:25:00Z",
        status: "completed",
        passed: true,
      },
      {
        id: 5,
        user: { id: 8, name: "Grace Taylor", email: "grace@example.com" },
        test: { id: 1, title: "Mobile Development Basics", subject: "mobile-development" },
        score: 60,
        totalQuestions: 15,
        correctAnswers: 9,
        startTime: "2023-05-11T11:10:00Z",
        endTime: "2023-05-11T11:40:00Z",
        status: "completed",
        passed: true,
      },
    ]

    // If user is a candidate, filter results to only show their own
    const filteredResults =
      session?.user?.role === "candidate"
        ? mockResults.filter((result) => result.user.email === session.user.email)
        : mockResults

    setResults(filteredResults)
    setLoading(false)
  }, [session])

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "" || result.test.subject === subjectFilter
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "passed" && result.passed) ||
      (statusFilter === "failed" && !result.passed)

    return matchesSearch && matchesSubject && matchesStatus
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatSubject = (subject) => {
    return subject
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end - start
    const minutes = Math.floor(durationMs / 60000)

    return `${minutes} min`
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Test Results"
          description={session?.user?.role === "candidate" ? "Your test results" : "View all test results"}
        />
        {(session?.user?.role === "admin" || session?.user?.role === "examiner") && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search results..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="graphic-design">Graphic Design</SelectItem>
              <SelectItem value="video-editing">Video Editing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All results</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {(session?.user?.role === "admin" || session?.user?.role === "examiner") && <TableHead>User</TableHead>}
              <TableHead>Test</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={session?.user?.role === "candidate" ? 7 : 8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((result) => (
                <TableRow key={result.id}>
                  {(session?.user?.role === "admin" || session?.user?.role === "examiner") && (
                    <TableCell className="font-medium">{result.user.name}</TableCell>
                  )}
                  <TableCell>{result.test.title}</TableCell>
                  <TableCell>{formatSubject(result.test.subject)}</TableCell>
                  <TableCell>
                    {result.score}% ({result.correctAnswers}/{result.totalQuestions})
                  </TableCell>
                  <TableCell>
                    <Badge className={result.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {result.passed ? "Passed" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(result.startTime)}</TableCell>
                  <TableCell>{calculateDuration(result.startTime, result.endTime)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        {(session?.user?.role === "admin" || session?.user?.role === "examiner") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download report
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

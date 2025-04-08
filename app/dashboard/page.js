"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileQuestion, ClipboardList, CheckCircle2, XCircle } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalQuestions: 0,
    totalResults: 0,
    recentTests: [],
    userPerformance: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For now, we'll use mock data
    const mockData = {
      totalUsers: 24,
      totalTests: 12,
      totalQuestions: 150,
      totalResults: 86,
      recentTests: [
        { id: 1, name: "Mobile Development", completions: 18, avgScore: 72 },
        { id: 2, name: "Web Development", completions: 32, avgScore: 68 },
        { id: 3, name: "Graphic Design", completions: 14, avgScore: 81 },
        { id: 4, name: "Video Editing", completions: 22, avgScore: 75 },
      ],
      userPerformance: [
        { id: 1, subject: "Mobile Development", score: 85, passed: true },
        { id: 2, subject: "Web Development", score: 92, passed: true },
        { id: 3, subject: "Graphic Design", score: 65, passed: true },
        { id: 4, subject: "Video Editing", score: 38, passed: false },
      ],
    }

    setStats(mockData)
    setLoading(false)
  }, [])

  const isAdmin = session?.user?.role === "admin"
  const isExaminer = session?.user?.role === "examiner"
  const isCandidate = session?.user?.role === "candidate"

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Heading title={`Welcome, ${session?.user?.name}`} description={`You are logged in as ${session?.user?.role}`} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isCandidate && <TabsTrigger value="performance">My Performance</TabsTrigger>}
          {(isAdmin || isExaminer) && <TabsTrigger value="tests">Tests</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(isAdmin || isExaminer) && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    <FileQuestion className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Completions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResults}</div>
              </CardContent>
            </Card>
          </div>

          {(isAdmin || isExaminer) && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Performance</CardTitle>
                <CardDescription>Overview of recent test completions and average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentTests.map((test) => (
                    <div key={test.id} className="flex items-center">
                      <div className="w-1/3 font-medium">{test.name}</div>
                      <div className="w-1/3 text-center">{test.completions} completions</div>
                      <div className="w-1/3 text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            test.avgScore >= 70 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {test.avgScore}% avg score
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isCandidate && (
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Test Results</CardTitle>
                <CardDescription>Your performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.userPerformance.map((result) => (
                    <div key={result.id} className="flex items-center">
                      <div className="w-1/3 font-medium">{result.subject}</div>
                      <div className="w-1/3 text-center">{result.score}%</div>
                      <div className="w-1/3 text-right">
                        {result.passed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(isAdmin || isExaminer) && (
          <TabsContent value="tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Statistics</CardTitle>
                <CardDescription>Detailed information about test performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentTests.map((test) => (
                    <div key={test.id} className="flex items-center">
                      <div className="w-1/3 font-medium">{test.name}</div>
                      <div className="w-1/3 text-center">{test.completions} completions</div>
                      <div className="w-1/3 text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            test.avgScore >= 70 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {test.avgScore}% avg score
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

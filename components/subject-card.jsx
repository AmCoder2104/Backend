"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Paintbrush, Smartphone, Video } from "lucide-react"

export default function SubjectCard({ subject }) {
  const router = useRouter()
  const { data: session } = useSession()

  const getIcon = (iconName) => {
    switch (iconName) {
      case "smartphone":
        return <Smartphone className="h-8 w-8 mb-2" />
      case "globe":
        return <Globe className="h-8 w-8 mb-2" />
      case "paintbrush":
        return <Paintbrush className="h-8 w-8 mb-2" />
      case "video":
        return <Video className="h-8 w-8 mb-2" />
      default:
        return null
    }
  }

  const handleStartTest = () => {
    if (session) {
      // User is authenticated, redirect to test
      router.push(`/test/${subject.id}`)
    } else {
      // User is not authenticated, redirect to login
      router.push("/auth/login")
    }
  }

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="flex flex-col items-center text-center">
        {getIcon(subject.icon)}
        <CardTitle>{subject.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{subject.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleStartTest}>
          Start Test
        </Button>
      </CardFooter>
    </Card>
  )
}


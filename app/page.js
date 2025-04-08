import SubjectCard from "@/components/subject-card"
import { Heading } from "@/components/ui/heading"
import { UserMenu } from "@/components/user-menu"

export default function Home() {
  const subjects = [
    {
      id: "mobile-development",
      title: "Mobile Development",
      description: "Test your knowledge of mobile app development concepts and frameworks.",
      icon: "smartphone",
    },
    {
      id: "web-development",
      title: "Web Development",
      description: "Challenge yourself with questions about web technologies and best practices.",
      icon: "globe",
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Evaluate your understanding of design principles and tools.",
      icon: "paintbrush",
    },
    {
      id: "video-editing",
      title: "Video Editing",
      description: "Test your knowledge of video editing techniques and software.",
      icon: "video",
    },
  ]

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <Heading title="Subject Knowledge Tests" description="Select a subject below to start a multiple-choice test" />
        <UserMenu />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </main>
  )
}


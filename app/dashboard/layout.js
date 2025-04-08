"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BarChart3, Users, FileQuestion, ClipboardList, Home, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if not authenticated or loading
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Redirect if authenticated but not admin or examiner
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.role !== "admin" &&
      session?.user?.role !== "examiner" &&
      session?.user?.role !== "candidate"
    ) {
      router.push("/")
    }
  }, [status, session, router])

  if (!isMounted || status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const isAdmin = session?.user?.role === "admin"
  const isExaminer = session?.user?.role === "examiner"
  const isCandidate = session?.user?.role === "candidate"

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      current: pathname === "/dashboard",
      roles: ["admin", "examiner", "candidate"],
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      current: pathname === "/dashboard/users",
      roles: ["admin"],
    },
    {
      name: "Tests",
      href: "/dashboard/tests",
      icon: ClipboardList,
      current: pathname === "/dashboard/tests",
      roles: ["admin", "examiner"],
    },
    {
      name: "Questions",
      href: "/dashboard/questions",
      icon: FileQuestion,
      current: pathname === "/dashboard/questions",
      roles: ["admin", "examiner"],
    },
    {
      name: "Results",
      href: "/dashboard/results",
      icon: BarChart3,
      current: pathname === "/dashboard/results",
      roles: ["admin", "examiner", "candidate"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(session?.user?.role))

  const NavLink = ({ item }) => (
    <Link
      href={item.href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        item.current
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-border bg-card px-4 py-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Test Management</h1>
          </div>
          <div className="mt-8 flex flex-col flex-1">
            <nav className="flex-1 space-y-2 px-2">
              {filteredNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
              <div className="pt-4">
                <Separator />
              </div>
              <Link
                href="/"
                className="flex items-center px-4 py-2 mt-4 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Home className="mr-3 h-5 w-5" />
                Home
              </Link>
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="flex w-full items-center px-4 py-2 mt-1 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-card">
            <div className="flex items-center justify-between px-4 py-5 border-b border-border">
              <h1 className="text-xl font-bold">Test Management</h1>
            </div>
            <nav className="flex-1 space-y-2 px-2 py-4">
              {filteredNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
              <div className="pt-4">
                <Separator />
              </div>
              <Link
                href="/"
                className="flex items-center px-4 py-2 mt-4 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Home className="mr-3 h-5 w-5" />
                Home
              </Link>
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="flex w-full items-center px-4 py-2 mt-1 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

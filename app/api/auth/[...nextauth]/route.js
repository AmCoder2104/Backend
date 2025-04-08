import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        await dbConnect()

        // Find user by email
        const user = await User.findOne({ email: credentials.email }).select("+password")

        if (!user) {
          throw new Error("No user found with this email")
        }

        if (!user.isActive) {
          throw new Error("This account has been deactivated")
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordMatch) {
          throw new Error("Invalid password")
        }

        // Update last login time
        await User.findByIdAndUpdate(user._id, {
          lastLogin: new Date(),
        })

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profileImage || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Always set role to admin regardless of what's in the database
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        // Always set role to admin in the session
        session.user.role = "admin"
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { serverSignUpSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedFields = serverSignUpSchema.safeParse(body)

    if (!validatedFields.success) {
      console.log("Validation errors:", validatedFields.error.errors)
      return NextResponse.json(
        { message: "Invalid input data", errors: validatedFields.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and profile in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
          subscriptionType: "FREE", 
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          subscriptionType: true,
          createdAt: true,
        }
      })

      // Create the user profile
      const profile = await tx.userProfile.create({
        data: {
          userId: user.id,
          language: "en", // Default language
          preferredGenres: [], // Empty array initially
        },
        select: {
          id: true,
          language: true,
          createdAt: true,
        }
      })

      return { user, profile }
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: result.user,
        profile: result.profile
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
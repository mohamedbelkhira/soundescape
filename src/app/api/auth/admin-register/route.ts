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
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    return NextResponse.json(
      {
        message: "User created successfully",
        user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
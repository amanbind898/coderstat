import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";

// Custom nanoid for short user IDs: usr_abc123xy (12 chars after prefix)
const generateUserId = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    12
);

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate short unique user ID
        const userId = `usr_${generateUserId()}`;

        // Create user
        await db.insert(users).values({
            id: userId,
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        return NextResponse.json(
            { message: "User created successfully", userId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

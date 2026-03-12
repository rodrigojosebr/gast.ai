import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/userRepository";
import { registerUserSchema } from "@/schemas/authSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = registerUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await UserRepository.create(name, email, passwordHash);

    return NextResponse.json(
      {
        message: "Usuário registrado com sucesso!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

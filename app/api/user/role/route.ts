import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { Role } from "@prisma/client";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { email, role } = body;

    let newRole: Role = role === Role.ADMIN ? Role.VIEWER : Role.ADMIN;

    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: newRole,
      },
    });

    return NextResponse.json(user);
    // return NextResponse.json(user);
  } catch (error) {
    console.error("[UPDATEROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

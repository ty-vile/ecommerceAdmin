import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

// NOTES - CREATE


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

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
    console.error("REGISTER_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// NOTES - DELETE

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const user = await prisma.user.delete({
      where: {
        email: body,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTER_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// NOTES UPDATE


export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { email, role, task } = body;

    if (!email || !task) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

   if (task === 'role') {

    if (!role) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

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
   }

   return null
  } catch (error) {
    console.error("USERROLE_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
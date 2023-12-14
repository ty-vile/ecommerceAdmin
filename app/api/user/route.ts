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
    console.error("USER_POST", error);
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
    console.error("USER_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// NOTES UPDATE

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { email, role, task } = body;

    if (!task) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    if (task === "role") {
      if (!email || !role) {
        return NextResponse.json("Bad Request - Missing required parameters.", {
          status: 400,
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

    return null;
  } catch (error) {
    console.error("USER_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

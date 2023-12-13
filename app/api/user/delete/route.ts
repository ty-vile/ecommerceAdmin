import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

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

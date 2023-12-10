import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const user = await prisma.user.delete({
      where: {
        email: body,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

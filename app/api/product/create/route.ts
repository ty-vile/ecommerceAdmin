import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";
// actions
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized credentials");
    }

    const body = await req.json();

    const { name, description } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        userId: user.id!,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

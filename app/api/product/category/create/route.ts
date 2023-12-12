import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { name } = body;

    if (!name) {
      throw new Error("Name is a required field.");
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

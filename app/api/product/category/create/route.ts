import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { category } = body;

    if (!category) {
      throw new Error("Name is a required field.");
    }

    const productCategory = await prisma.category.create({
      data: {
        name: category,
      },
    });

    return NextResponse.json(productCategory);
  } catch (error) {
    console.error("[CATEGORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

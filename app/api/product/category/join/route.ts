import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { productId, categoryId, createdByUser } = body;

    if (!productId || !categoryId || !createdByUser) {
      throw new Error(
        "Product ID, Category ID & Created By are required fields"
      );
    }

    const categoryJoin = await prisma.categoriesToProducts.create({
      data: {
        createdBy: createdByUser,
        productId,
        categoryId,
      },
    });

    return NextResponse.json(categoryJoin);
  } catch (error) {
    console.error("[CATEGORYPRODUCTJOIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

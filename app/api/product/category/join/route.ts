import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/users/getCurrentUser";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { productId, categoryId, createdByUser } = body;

    if (!productId || !categoryId || !createdByUser) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
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
    console.error("CATEGORYPRODUCTJOIN_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

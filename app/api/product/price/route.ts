import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/users/getCurrentUser";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { price } = body;

    if (!price) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const productPrice = await prisma.productSkuPrice.create({
      data: {
        price: Number(price),
      },
    });

    return NextResponse.json(productPrice);
  } catch (error) {
    console.error("PRODUCTSKU_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

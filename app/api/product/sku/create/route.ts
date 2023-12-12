import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { productId, sku, price, quantity } = body;

    const productSku = await prisma.productSku.create({
      data: {
        productId: "",
        sku: "",
        price: 0,
        quantity: 0,
        isDefault: false,
      },
    });

    return NextResponse.json(productSku);
  } catch (error) {
    console.error("[PRODUCTSKU_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

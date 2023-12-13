import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { productId, sku } = body;

    if (!productId || !sku) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const productSku = await prisma.productSku.create({
      data: {
        productId: productId,
        sku: sku,
        price: 0,
        quantity: 0,
        isDefault: false,
      },
    });

    return NextResponse.json(productSku);
  } catch (error) {
    console.error("PRODUCTSKU_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

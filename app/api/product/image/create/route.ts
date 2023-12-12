import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { url, productSkuId } = body;

    if (!url || !productSkuId) {
      throw new Error("URL and Product Sku Id are required fields");
    }

    const product = await prisma.productImage.create({
      data: {
        url: "",
        productSkuId: "",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTIMAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

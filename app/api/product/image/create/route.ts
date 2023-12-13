import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { url, productSkuId } = body;

    if (!url || !productSkuId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const product = await prisma.productImage.create({
      data: {
        url: "",
        productSkuId: "",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCTIMAGE_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

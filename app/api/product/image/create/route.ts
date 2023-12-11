import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const { url, productSkuId } = body;

    const product = await prisma.productImage.create({
      data: {
        url: "",
        productSkuId: "",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

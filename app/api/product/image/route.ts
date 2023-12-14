import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/users/getCurrentUser";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { url, productSkuId } = body;

    if (!url || !productSkuId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const productImage = await prisma.productImage.create({
      data: {
        url: url,
        productSkuId: productSkuId,
      },
    });

    return NextResponse.json(productImage);
  } catch (error) {
    console.error("PRODUCTIMAGE_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

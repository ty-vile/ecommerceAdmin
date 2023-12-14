import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    console.log(user, "USER");

    if (!user) {
      return NextResponse.json("Unauthorized", {
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

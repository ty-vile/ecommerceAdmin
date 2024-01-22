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

    const { skuId, productAttributeValueId } = body;

    if (!skuId || !productAttributeValueId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const linkSkuAttributeValue = await prisma.productAttributeSku.create({
      data: {
        skuId: skuId,
        attributeValueId: productAttributeValueId,
      },
    });

    return NextResponse.json(linkSkuAttributeValue);
  } catch (error) {
    console.error("ATTRIBUTE_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

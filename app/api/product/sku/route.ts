import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/users/getCurrentUser";
import getAllSkus from "@/actions/skus/getAllSkus";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { productId, sku, quantity } = body;

    if (!productId || !sku || !quantity) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const previousSkus = await getAllSkus(productId);

    const productSku = await prisma.productSku.create({
      data: {
        productId: productId,
        sku: sku,
        quantity: Number(quantity),
        isDefault: previousSkus.length > 0 ? false : true,
      },
    });

    return NextResponse.json(productSku);
  } catch (error) {
    console.error("PRODUCTSKU_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { skuId } = body;

    if (!skuId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const deletedSku = await prisma.productSku.delete({
      where: {
        id: skuId,
      },
    });

    return NextResponse.json(deletedSku);
  } catch (error) {
    console.error("PRODUCTSKU_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { quantity, skuId } = body;

    if (!quantity || !skuId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const product = await prisma.productSku.update({
      where: {
        id: skuId,
      },
      data: {
        quantity: quantity,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCTSKU_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

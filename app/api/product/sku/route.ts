import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/users/getCurrentUser";
import { GETREQUESTS } from "@/app/libs/types";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

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

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { task, skuId, productId } = body;

    if (!task) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    // GET - SINGLE PRODUCT
    if (task === GETREQUESTS.SINGLE) {
      if (!skuId) {
        return NextResponse.json("Bad Request - Missing required parameters.", {
          status: 400,
        });
      }

      const sku = await prisma.productSku.findUnique({
        where: {
          id: skuId,
        },
        include: {
          productImage: true,
        },
      });

      return NextResponse.json(sku);
    }

    if (task === GETREQUESTS.ALL) {
      if (!productId) {
        return NextResponse.json("Bad Request - Missing required parameters.", {
          status: 400,
        });
      }

      const products = await prisma.productSku.findMany({
        where: {
          productId: productId,
        },
      });

      return NextResponse.json(products);
    }

    return null;
  } catch (error) {
    console.error("PRODUCTSKU_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

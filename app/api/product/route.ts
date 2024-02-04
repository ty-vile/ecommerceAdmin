import { NextRequest, NextResponse } from "next/server";

// prisma
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/users/getCurrentUser";
// actions

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        userId: user.id!,
        isArchived: false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT_POST", error);
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

    const { productId } = body;

    if (!productId) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("PRODUCT_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const products = await prisma.product.findMany({});

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("PRODUCT_ALL_GET", error);
    throw new Error(error);
  }
}

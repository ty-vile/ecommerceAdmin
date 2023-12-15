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
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    console.log("USER", user);

    return NextResponse.json("");
  } catch (error) {
    console.error("PRODUCT_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

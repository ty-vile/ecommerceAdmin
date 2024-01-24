import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/users/getCurrentUser";
import { CreateAttributeValue } from "@/app/libs/api";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { productAttribute } = body;

    if (!productAttribute) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const createdAttribute = await prisma.productAttribute.create({
      data: {
        name: productAttribute,
      },
    });

    return NextResponse.json(createdAttribute);
  } catch (error) {
    console.error("ATTRIBUTE_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

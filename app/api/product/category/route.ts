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

    const { name } = body;

    if (!name) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const productCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(productCategory);
  } catch (error) {
    console.error("CATEGORY_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

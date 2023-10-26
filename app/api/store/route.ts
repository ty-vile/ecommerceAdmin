import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();

    const { name } = body;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId: currentUser?.id,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

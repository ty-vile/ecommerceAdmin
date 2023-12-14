import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/users/getCurrentUser";

export async function POST(req: Request, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { category } = body;

    if (!category) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    const productCategory = await prisma.category.create({
      data: {
        name: category,
      },
    });

    return NextResponse.json(productCategory);
  } catch (error) {
    console.error("CATEGORY_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, res: NextResponse) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json("Unathorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { categoryId, task } = body;

    if (!task) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    if (task === "getcategory") {
      if (!categoryId) {
        return NextResponse.json("Bad Request - Missing required parameters.", {
          status: 400,
        });
      }

      const productCategory = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      return NextResponse.json(productCategory);
    }

    if (task === "allcategories") {
      const categories = await prisma.category.findMany({});
      return NextResponse.json(categories);
    }

    return null;
  } catch (error) {
    console.error("CATEGORY_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

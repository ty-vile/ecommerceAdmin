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

    const { attributes } = body;

    if (!attributes) {
      return NextResponse.json("Bad Request - Missing required parameters.", {
        status: 400,
      });
    }

    for (const attribute of attributes) {
      const createdAttribute = await prisma.productAttribute.create({
        data: {
          name: attribute.productAttribute,
        },
      });

      if (!createdAttribute) {
        return NextResponse.json("Error creating attribute.", {
          status: 400,
        });
      }

      for (const attributeValue of attribute.productAttributeValues) {
        const attributeValueData = {
          name: attributeValue.name,
          productAttributeId: createdAttribute.id,
        };

        const createdAttributeValue = await CreateAttributeValue(
          attributeValueData
        );

        if (!createdAttributeValue) {
          return NextResponse.json("Error creating attribute.", {
            status: 400,
          });
        }
      }
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("ATTRIBUTE_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

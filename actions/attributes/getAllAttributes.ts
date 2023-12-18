import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getAllAttributes() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const attributes = await prisma.productAttribute.findMany({
      include: {
        productAttributeValues: true,
      },
    });

    return attributes;
  } catch (error: any) {
    console.error("ATRRIBUTES_ALL_GET", error);
    throw new Error(error);
  }
}

import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getCategory from "../categories/getCategory";

export default async function getProduct(productId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return product;
  } catch (error: any) {
    console.error("PRODUCT_SINGLE_GET", error);
    throw new Error(error);
  }
}

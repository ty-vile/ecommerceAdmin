import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IProduct {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: {
    category: {
      id: string;
      name: string;
    };
  }[];
}

export default async function getProduct(
  productId: string
): Promise<IProduct | null> {
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

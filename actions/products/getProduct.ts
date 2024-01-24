import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { CategoriesToProducts, Category, Product } from "@prisma/client";

interface IProduct extends Product {
  categories?: ICategoriesToProducts[];
}

interface ICategoriesToProducts extends CategoriesToProducts {
  category: Category;
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
            category: true,
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

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
        categories: true,
      },
    });

    let productCategories: string[] = [];

    if (product) {
      for (let category of product.categories) {
        let categoryName = await getCategory(category.categoryId);

        if (categoryName) {
          productCategories.push(categoryName?.name);
        }
      }
    }

    console.log("CATEGORY", productCategories);

    return { product, productCategories };
  } catch (error: any) {
    console.error("PRODUCT_SINGLE_GET", error);
    throw new Error(error);
  }
}

import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { CategoriesToProducts, Category, Product } from "@prisma/client";

export default async function getProductImages(sku: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const productImages = await prisma.productImage.findMany({
      where: {
        productSkuId: sku,
      },
    });

    console.log(productImages);

    return productImages;
  } catch (error: any) {
    console.error("PRODUCTIMAGE_SINGLE_GET", error);
    throw new Error(error);
  }
}

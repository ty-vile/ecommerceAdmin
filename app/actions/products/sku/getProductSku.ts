import prisma from "@/app/libs/prismadb";

export default async function getProductSku(skuId: string) {
  try {
    if (!skuId) {
      return null;
    }

    const sku = await prisma.productSku.findUnique({
      where: {
        id: skuId,
      },
      include: {
        productImage: true,
      },
    });

    return sku;
  } catch (error: any) {
    console.error("PRODUCTSSKU_GET", error);
    throw new Error(error);
  }
}

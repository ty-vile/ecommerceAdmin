import prisma from "@/app/libs/prismadb";

export default async function getProductSku(skuId: string) {
  try {
    if (!skuId) {
      throw new Error("Must provide product ID");
    }

    const sku = await prisma.productSku.findUnique({
      where: {
        id: skuId,
      },
    });

    return sku;
  } catch (error: any) {
    console.error(["PRODUCTSSKU_GET"], error);
    throw new Error(error);
  }
}

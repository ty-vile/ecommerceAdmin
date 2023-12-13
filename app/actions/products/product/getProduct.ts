import prisma from "@/app/libs/prismadb";

export default async function getProduct(productId: string) {
  try {
    if (!productId) {
      return null;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
      },
    });

    return product;
  } catch (error: any) {
    console.error("SINGLEPRODUCT_GET", error);
    throw new Error(error);
  }
}

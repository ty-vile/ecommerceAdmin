import prisma from "@/app/libs/prismadb";

export default async function getProduct(productId: string) {
  try {
    if (!productId) {
      throw new Error("Must provide product ID");
    }

    const categories = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    return categories;
  } catch (error: any) {
    console.error(["ALLCATEGORIES_GET"], error);
    throw new Error(error);
  }
}

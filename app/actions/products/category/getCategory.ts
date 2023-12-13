import prisma from "@/app/libs/prismadb";

export default async function getCategory(categoryId: string) {
  try {
    if (!categoryId) {
      return null;
    }

    const productCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return productCategory;
  } catch (error: any) {
    console.error("SINGLECATEGORY_GET", error);
    throw new Error(error);
  }
}

import prisma from "@/app/libs/prismadb";

export default async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({});

    return categories;
  } catch (error: any) {
    console.error(["ALLCATEGORIES_GET"], error);
    throw new Error(error);
  }
}

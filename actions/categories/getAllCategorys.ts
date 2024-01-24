import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getAllCategorys() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const categories = await prisma.category.findMany({});

    return categories;
  } catch (error: any) {
    console.error("CATEGORY_ALL_GET", error);
    throw new Error(error);
  }
}

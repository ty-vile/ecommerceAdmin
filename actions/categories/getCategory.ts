import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { ACTION_TYPE } from "@/app/libs/types";
import { Category } from "@prisma/client";

export default async function getCategory(categoryId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    if (!categoryId) {
      throw new Error("Missing required parameters");
    }

    const productCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return productCategory;
  } catch (error: any) {
    console.error("CATEGORY_SINGLE_GET", error);
    throw new Error(error);
  }
}

import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getAllProducts() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const products = await prisma.product.findMany({
      include: { categories: true },
    });

    return products;
  } catch (error: any) {
    console.error("PRODUCT_ALL_GET", error);
    throw new Error(error);
  }
}

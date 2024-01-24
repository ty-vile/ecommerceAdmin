import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IProduct {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: {};
  sku: {}[];
}

export default async function getAllProducts() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const products = await prisma.product.findMany({
      include: { categories: true, sku: true },
    });

    return products as IProduct[];
  } catch (error: any) {
    console.error("PRODUCT_ALL_GET", error);
    throw new Error(error);
  }
}

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

    const sortedProducts = products.sort((a, b) => {
      const nameA = a.name.toLowerCase(); // Convert names to lowercase for case-insensitive sorting
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0; // names are equal
    });

    return sortedProducts as IProduct[];
  } catch (error: any) {
    console.error("PRODUCT_ALL_GET", error);
    throw new Error(error);
  }
}

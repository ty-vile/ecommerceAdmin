import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface Sku {
  id: string;
  sku: string;
  productId: string;
  quantity: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  price:
    | {
        id: string;
        skuId: string;
        price: number;
        createdAt: Date;
      }[];

  formattedCreatedAt?: string;
  currentPrice?: number;
}

export default async function getAllSkus(productId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    if (!productId) {
      throw new Error("Missing required parameters");
    }

    const allSkus = await prisma.productSku.findMany({
      where: {
        productId: productId,
      },

      include: {
        price: {},
      },
    });

    allSkus.forEach((sku) => {
      if (sku.createdAt instanceof Date) {
      }
    });

    return allSkus as Sku[];
  } catch (error: any) {
    console.error("SKU_ALL_GET", error);
    throw new Error(error);
  }
}

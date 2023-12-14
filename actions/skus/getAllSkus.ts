import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getSku(productId: string) {
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
    });

    return allSkus;
  } catch (error: any) {
    console.error("SKU_ALL_GET", error);
    throw new Error(error);
  }
}

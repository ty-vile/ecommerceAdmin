import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getSku(skuId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    if (!skuId) {
      throw new Error("Missing required parameters");
    }

    const sku = await prisma.productSku.findUnique({
      where: {
        id: skuId,
      },
      include: {
        productImage: true,
        // gets product attribute & attribute values
        productAttributeSku: {
          include: {
            attribute: {
              include: {
                productAttribute: true,
              },
            },
          },
        },
      },
    });

    return sku;
  } catch (error: any) {
    console.error("SKU_SINGLE_GET", error);
    throw new Error(error);
  }
}

import prisma from "@/app/libs/prismadb";

export default async function getAllProducts() {
try {
    const products = await prisma.product.findMany({});

    return products;
  } catch (error: any) {
    console.error("ALLPRODUCTS_GET", error);
    throw new Error(error);
  }
}

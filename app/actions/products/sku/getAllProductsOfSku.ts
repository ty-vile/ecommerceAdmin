// import prisma from "@/app/libs/prismadb";

// export default async function getAllProductsOfSku(productId: string) {
//   try {
//     if (!productId) {
//       return null;
//     }

//     const products = await prisma.productSku.findMany({
//       where: {
//         productId: productId,
//       },
//     });

//     return products;
//   } catch (error: any) {
//     console.error("PRODUCTSSKU_GET", error);
//     throw new Error(error);
//   }
// }

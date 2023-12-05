import prisma from "@/app/libs/prismadb";

interface GetStoreTypes {
  userId: string | undefined;
}

export default async function getStores(params: GetStoreTypes) {
  try {
    const { userId } = params;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const stores = await prisma.store.findMany({
      where: {
        userId,
      },
    });

    return stores;
  } catch (error: any) {
    console.log(["STORES_GET"], error);
    throw new Error(error);
  }
}

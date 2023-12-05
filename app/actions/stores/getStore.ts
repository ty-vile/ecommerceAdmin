import prisma from "@/app/libs/prismadb";

interface GetStoreTypes {
  storeId?: string | undefined;
  userId: string | undefined;
}

export default async function getStore(params: GetStoreTypes) {
  try {
    const { storeId, userId } = params;

    if (!userId) {
      throw new Error("User ID not found");
    }

    // if storeId and userId are passed as params
    if (storeId && userId) {
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          userId: userId,
        },
      });

      return store;
    }

    // if only userId is passed as param
    if (!storeId && userId) {
      const store = await prisma.store.findFirst({
        where: {
          userId: userId,
        },
      });

      return store;
    }
  } catch (error: any) {
    console.log(["STORE_GET"], error);
    throw new Error(error);
  }
}

import prisma from "@/app/libs/prismadb";

import { getCurrentSession } from "./getSession";

export default async function getCurrentUser() {
  try {
    const session = await getCurrentSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });

    const user = {
      id: currentUser?.id,
      name: currentUser?.name,
      email: currentUser?.email,
      image: currentUser?.image,
      role: currentUser?.role,
    };

    return user;
  } catch (error: any) {
    console.error(["CURRENTUSER_GET"], error);
    throw new Error(error);
  }
}

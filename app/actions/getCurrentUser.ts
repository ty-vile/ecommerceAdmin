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

    return currentUser;
  } catch (error) {
    return null;
  }
}

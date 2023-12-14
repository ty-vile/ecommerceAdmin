import prisma from "@/app/libs/prismadb";

import { getCurrentSession } from "../getSession";

export default async function getCurrentUser() {
  try {
    const session = await getCurrentSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return currentUser;
  } catch (error: any) {
    console.error(["USER_CURRENT_GET"], error);
    throw new Error(error);
  }
}

import prisma from "@/app/libs/prismadb";

import { getCurrentSession } from "./getSession";
import { User } from "@prisma/client";

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
      id: currentUser?.id!,
      name: currentUser?.name!,
      email: currentUser?.email!,
    };

    return user;
  } catch (error) {
    console.log(["CURRENTUSER_GET"], error);
    return null;
  }
}

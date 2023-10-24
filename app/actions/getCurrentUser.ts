import prisma from "@/app/libs/prismadb";
import { getSession } from "next-auth/react";

export default async function getCurrentUser() {
  try {
    const session = await getSession();

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

import prisma from "@/app/libs/prismadb";

export default async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    return users;
  } catch (error: any) {
    console.log(["ALLUSERS_GET"], error);
    throw new Error(error);
  }
}

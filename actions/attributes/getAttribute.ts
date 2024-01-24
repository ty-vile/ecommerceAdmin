import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getAttribute(attributeId?: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    if (!attributeId) {
      throw new Error("Missing required parameters");
    }

    const attribute = await prisma.productAttribute.findUnique({
      where: {
        id: attributeId,
      },
    });

    return attribute;
  } catch (error: any) {
    console.error("ATTRIBUTE_SINGLE_GET", error);
    throw new Error(error);
  }
}

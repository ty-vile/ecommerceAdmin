import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getAllAttributeValues() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    const attributeValues = await prisma.productAttributeValue.findMany({});

    return attributeValues;
  } catch (error: any) {
    console.error("ATTRIBUTE_VALUES_ALL_GET", error);
    throw new Error(error);
  }
}

import getCurrentUser from "@/actions/users/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getAttribute from "../attributes/getAttribute";
import getAllAttributeValues from "../attributeValues/getAllAttributeValues";

export default async function getSkuAttributes(skuId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorised credentials");
    }

    if (!skuId) {
      throw new Error("Missing required parameters");
    }

    const attributeValues = await getAllAttributeValues();

    const skuAttributes = await prisma.productAttributeSku.findMany({
      where: {
        skuId: skuId,
      },
    });

    const skuAttributeArr: {
      valueId: string | undefined;
      valueName: string | undefined;
      attributeId: string | undefined;
      attributeName: string | undefined;
    }[] = [];

    // LOOP OVER SKU ATTRIBUTES
    skuAttributes.forEach(async (attribute) => {
      // FIND MATCHING VALUE FROM ALL ATTRIBUTE VALUE LIST AS IT HAS PARENT ID
      const matchingAttributeValue = attributeValues.find(
        ({ id }) => id === attribute.attributeValueId
      );

      // GET PARENT ATTRIBUTE
      const parentAttribute = await getAttribute(
        matchingAttributeValue?.productAttributeId
      );

      const attributeData = {
        valueId: matchingAttributeValue?.id,
        valueName: matchingAttributeValue?.name,
        attributeId: parentAttribute?.id,
        attributeName: parentAttribute?.name,
      };

      return skuAttributeArr.push(attributeData);
    });

    return skuAttributeArr;
  } catch (error: any) {
    console.error("SKUATTRIBUTES_ALL_GET", error);
    throw new Error(error);
  }
}

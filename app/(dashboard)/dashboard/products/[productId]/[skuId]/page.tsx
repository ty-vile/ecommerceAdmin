// actions
import getAllAttributes from "@/actions/attributes/getAllAttributes";
import getProduct from "@/actions/products/getProduct";
import getSku from "@/actions/skus/getSku";
import getSkuAttributes from "@/actions/skus/getSkuAttributes";
import getSkuPrices from "@/actions/skus/getSkuPrices";
// components
import ProductSkuForm from "@/app/(dashboard)/dashboard/products/[productId]/[skuId]/components/forms/update-product-form";
import { notFound } from "next/navigation";

type Props = {
  productId: string;
  skuId: string;
};

const ProductSKUPage = async ({ params }: { params: Props }) => {
  const { productId, skuId } = params;

  const product = await getProduct(productId);
  const sku = await getSku(skuId);
  const attributes = await getSkuAttributes(skuId);
  const skuPrices = await getSkuPrices(skuId);

  console.log(attributes, "AB");

  const sortedPrices = skuPrices.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const currentPrice = sortedPrices[0].price;

  const categoryNames = product?.categories?.map((cat) => cat.category);

  if (!product || !sku) {
    return notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <h5 className="font-bold">SKU: {sku.sku.toUpperCase()}</h5>
      </div>
      <div className="p-4 m-4 bg-white rounded-md shadow-sm">
        <ProductSkuForm
          product={product}
          sku={sku}
          price={currentPrice}
          // attributes={attributes}
          productCategories={categoryNames}
        />
      </div>
    </div>
  );
};

export default ProductSKUPage;

// actions
import getProduct from "@/actions/products/getProduct";
import getSku from "@/actions/skus/getSku";
// components
import ProductSkuForm from "@/components/forms/dashboard/product/product-sku-form";

type Props = {
  productId: string;
  skuId: string;
};

const ProductSKUPage = async ({ params }: { params: Props }) => {
  const { productId, skuId } = params;

  const { product, productCategories } = await getProduct(productId);
  const sku = await getSku(skuId);

  if (!product || !sku) {
    return;
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-blue-500 text-white">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        {/* {productCategories.length > 0 &&
          productCategories.map((category, i) => (
            <div key={i} className="px-4 p-2 rounded-md">
              {category}
            </div>
          ))} */}
        <h5>{sku.sku}</h5>
      </div>
      <div className="p-4 m-4 bg-white rounded-md shadow-sm">
        <ProductSkuForm product={product} sku={sku} />
      </div>
    </div>
  );
};

export default ProductSKUPage;

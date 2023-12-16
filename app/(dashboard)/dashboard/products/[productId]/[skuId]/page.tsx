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

  const categoryArr: string[] = [];

  const product = await getProduct(productId);
  const sku = await getSku(skuId);

  if (!product || !sku) {
    return;
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-blue-500">
        <h3 className="text-4xl text-white font-bold">{product.name}</h3>
        {categoryArr.length > 0 &&
          categoryArr.map((category, i) => (
            <div key={i} className="bg-blue-600 text-white px-4 p-2 rounded-md">
              {category}
            </div>
          ))}
      </div>
      <div className="p-4 m-4 bg-white rounded-md shadow-sm">
        <ProductSkuForm product={product} sku={sku} />
      </div>
    </div>
  );
};

export default ProductSKUPage;

// actions
import getCategory from "@/app/actions/products/category/getCategory";
import getProduct from "@/app/actions/products/product/getProduct";
import getProductSku from "@/app/actions/products/sku/getProductSku";
// components
import ProductSkuForm from "@/components/forms/dashboard/product/product-sku-form";

type Props = {
  productId: string;
  skuId: string;
};

const ProductSKUPage = async ({ params }: { params: Props }) => {
  const { productId, skuId } = params;

  const categoryArr: string[] = [];
  const product = await getProduct(productId).then(async (productData) => {
    for (const category of productData?.categories || []) {
      const cat = await getCategory(category.categoryId);

      categoryArr.push(cat?.name!);
    }
    return productData;
  });
  const sku = await getProductSku(skuId);

  console.log(sku);

  if (!product) {
    // add error route (error.tsx)
  }

  if (!sku) {
    // add error route (error.tsx)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-4xl font-bold">{product?.name}</h3>
        {categoryArr.length > 0 &&
          categoryArr.map((category, i) => {
            return (
              <div
                key={i}
                className="bg-blue-600 text-white px-4 p-2 rounded-md"
              >
                {category}
              </div>
            );
          })}
      </div>
      <div className="p-4 bg-white rounded-md">
        <ProductSkuForm product={product!} sku={sku} />
      </div>
    </div>
  );
};

export default ProductSKUPage;

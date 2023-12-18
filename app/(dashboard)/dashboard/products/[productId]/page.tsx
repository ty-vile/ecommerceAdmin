import getAllProducts from "@/actions/products/getAllProducts";
import getProduct from "@/actions/products/getProduct";
import { notFound } from "next/navigation";

type Props = {
  productId: string;
};

const ProductPage = async ({ params }: { params: Props }) => {
  const { productId } = params;

  const product = await getProduct(productId);

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">{product.name}</h1>
      </div>
      <div className="p-4 m-4 bg-white rounded-md shadow-sm">
        {/* <ProductSkuForm product={product} sku={sku} /> */}
      </div>
    </div>
  );
};

export default ProductPage;

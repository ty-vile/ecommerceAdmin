// actions
import getProduct from "@/app/actions/products/product/getProduct";

type Props = {
  productId: string;
  skuId: string;
};

const ProductSKUPage = async ({ params }: { params: Props }) => {
  const { productId, skuId } = params;

  const product = await getProduct(productId);

  return (
    <div className="p-4">
      <div>
        <h3 className="text-4xl font-bold">PRODUCTS ADMIN</h3>
      </div>
      <div className="p-4 bg-white rounded-md">{/* PRODUCT CARD HERE */}</div>
    </div>
  );
};

export default ProductSKUPage;

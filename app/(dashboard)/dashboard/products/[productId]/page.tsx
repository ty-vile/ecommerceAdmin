// actions
import getProduct from "@/actions/products/getProduct";
import getAllSkus from "@/actions/skus/getAllSkus";
// tables
import { DataTable } from "@/components/table/data-table";
import { DashboardProductSkusColumns } from "@/components/table/productskus/columns";
// nextjs
import { notFound } from "next/navigation";

type Props = {
  productId: string;
};

const ProductPage = async ({ params }: { params: Props }) => {
  const { productId } = params;

  const product = await getProduct(productId);
  const productSkus = await getAllSkus(productId);

  productSkus.forEach((element) => {
    element.currentPrice = element?.price[element.price.length - 1].price;
  });

  if (!product || !productSkus) {
    return notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">{product.name}</h1>
      </div>
      <div className="p-4 m-4 bg-white rounded-md shadow-sm">
        <DataTable
          columns={DashboardProductSkusColumns}
          data={productSkus}
          searchValue={"skucode"}
        />
      </div>
    </div>
  );
};

export default ProductPage;

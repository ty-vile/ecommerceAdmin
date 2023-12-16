// action
import getAllCategorys from "@/actions/categories/getAllCategorys";
// form
import CreateProductForm from "@/components/forms/dashboard/product/create-product-form";

const CreateProductsPage = async () => {
  const categories = await getAllCategorys();

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">CREATE PRODUCT</h1>
      </div>
      <div className="p-4 m-4 bg-white rounded-md">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
};

export default CreateProductsPage;

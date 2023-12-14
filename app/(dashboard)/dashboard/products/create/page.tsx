// action
import getAllCategorys from "@/actions/categories/getAllCategorys";
// form
import CreateProductForm from "@/components/forms/dashboard/product/create-product-form";

const CreateProducstPage = async () => {
  const categories = await getAllCategorys();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-4xl font-bold ">CREATE PRODUCT</h3>
      </div>
      <div className="p-4 bg-white rounded-md">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
};

export default CreateProducstPage;

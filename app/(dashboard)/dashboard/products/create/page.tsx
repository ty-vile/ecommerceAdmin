// actions
import getAllCategories from "@/app/actions/products/category/getAllCategories";

// form
import CreateProductForm from "@/components/forms/dashboard/product/create-product-form";

const CreateProducstPage = async () => {
  const categories = await getAllCategories();

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

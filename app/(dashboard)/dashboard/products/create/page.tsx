// actions
import getAllCategories from "@/app/actions/products/category/getAllCategories";
import getCurrentUser from "@/app/actions/getCurrentUser";
// form
import CreateProductForm from "@/components/forms/dashboard/create-product-form";

const AddProductsPage = async () => {
  const currentUser = await getCurrentUser();
  const categories = await getAllCategories();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-4xl font-bold pb-6">CREATE PRODUCT</h3>
      </div>
      <div className="p-4 bg-white rounded-md">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
};

export default AddProductsPage;

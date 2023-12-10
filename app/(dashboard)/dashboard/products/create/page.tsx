// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
// form
import CreateProductForm from "@/components/forms/auth/create-product-form";

const AddProductsPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="p-4">
      <h3 className="text-4xl font-bold pb-6">CREATE PRODUCT</h3>
      <div className="p-4 bg-white rounded-md">
        <CreateProductForm />
      </div>
    </div>
  );
};

export default AddProductsPage;

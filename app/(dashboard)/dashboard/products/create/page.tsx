// actions
import getCurrentUser from "@/app/actions/getCurrentUser";

const AddProductsPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="p-4">
      <h3 className="text-4xl font-bold pb-6">CREATE PRODUCT</h3>
      <div className="p-4 bg-white rounded-md">{/* FORM HERE */}</div>
    </div>
  );
};

export default AddProductsPage;

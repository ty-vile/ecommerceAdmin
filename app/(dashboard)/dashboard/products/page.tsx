// actions
import getCurrentUser from "@/app/actions/users/getCurrentUser";
// tabledata
import { DataTable } from "@/components/table/data-table";
// components
import { Button } from "@/components/ui/button";
// next js
import Link from "next/link";
// icons
import { FaPlus } from "react-icons/fa";

const ProductsPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-4xl font-bold">PRODUCTS ADMIN</h3>
        <Link href="/dashboard/products/create">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300">
            <FaPlus />
            Create new product
          </Button>
        </Link>
      </div>
      <div className="p-4 bg-white rounded-md">{/* DATA TABLE HERE */}</div>
    </div>
  );
};

export default ProductsPage;

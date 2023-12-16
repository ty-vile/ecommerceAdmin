// actions
import getAllProducts from "@/actions/products/getAllProducts";
import getCurrentUser from "@/actions/users/getCurrentUser";
// tables
import { DataTable } from "@/components/table/data-table";
import { DashboardProductColumns } from "@/components/table/products/columns";
// types
import { Role } from "@prisma/client";
// nextjs
import Link from "next/link";
import { redirect } from "next/navigation";

// components
import { Button } from "@/components/ui/button";
// icons
import { FaPlus } from "react-icons/fa";

const ProductsPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">PRODUCTS ADMIN</h1>
        <Link href="/dashboard/products/create">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300">
            <FaPlus />
            Create new product
          </Button>
        </Link>
      </div>
      <div className="p-4 m-4 bg-white rounded-md">
        <DataTable columns={DashboardProductColumns} data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;

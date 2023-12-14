// api
import getCurrentUser from "@/app/actions/users/getCurrentUser";
import { GetProduct } from "@/app/libs/api";
// tables
import { DataTable } from "@/components/table/data-table";
import { DashboardProductColumns } from "@/components/table/products/columns";
// types
import { Role } from "@prisma/client";
// nextjs
import { redirect } from "next/navigation";
// types
import { GETREQUESTS } from "@/app/libs/types";

const ProductsPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const products = await GetProduct({ productId: "", task: GETREQUESTS.ALL });

  return (
    <div className="p-4">
      <h3 className="text-4xl font-bold pb-6">PRODUCTS ADMIN</h3>
      {/* @ts-ignore */}
      <div className="p-4 bg-white rounded-md">
        {/* @ts-ignore */}
        <DataTable columns={DashboardProductColumns} data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;

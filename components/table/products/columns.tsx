"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// actions
import { DeleteProduct } from "@/app/libs/api";
import TableDropdown from "../table-dropdown";
// components

type DashboardProducts = {
  id: string;
  sku: {}[];
  name: string;
};

export const DashboardProductColumns: ColumnDef<DashboardProducts>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "Total Skus (#)",
    id: "totalSkus",
    cell: ({ row }) => {
      const data = row.original;

      return <div key={row.index}>{data.sku.length}</div>;
    },
  },

  {
    accessorKey: "view",
    header: "View Product Skus",
    id: "viewProductSkus",
    cell: ({ row }) => {
      const [isLoading, setIsLoading] = useState(false);

      const data = row.original;

      const { id, name } = data;

      const router = useRouter();

      const submitDelete = async (productId: string) => {
        setIsLoading(true);
        try {
          await DeleteProduct({ productId: id });

          toast.success(`Deleted product: ${name}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error deleting product");
        } finally {
          setIsLoading(false);
        }
      };

      // JSX COMPONENT TO VIEW SKU
      return (
        <TableDropdown
          isLoading={isLoading}
          actionButton={"View All Skus"}
          deleteData={{
            deleteId: id,
            deleteButton: "Delete Product",
            onDelete: () => submitDelete(id),
          }}
          modalData={{
            modalTitle: `Confirm Deleting: ${name}`,
            modalContent:
              "This action cannot be undone. Are you sure you want to permanently delete this product.",
            modalButton: "Confirm",
          }}
          navigateData={{
            navigatePath: `/dashboard/products/${id}`,
            onNavigate: () => router.push(`/dashboard/products/${id}`),
          }}
        />
      );
    },
  },
];

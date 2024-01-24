"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";
import { useState } from "react";
// actions
import { DeleteProductSku } from "@/app/libs/api";
// toast
import { toast } from "react-toastify";
import TableDropdown from "../table-dropdown";
// components

type DashboardProductSkus = {
  productId: string;
  id: string;
};

export const DashboardProductSkusColumns: ColumnDef<DashboardProductSkus>[] = [
  {
    accessorKey: "sku",
    header: "SKU Code",
  },
  {
    accessorKey: "formattedCreatedAt",
    header: "Date Created",
  },
  {
    accessorKey: "currentPrice",
    header: "Price ($)",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "view",
    header: "View Product",
    id: "actions",
    cell: ({ row }) => {
      const [isLoading, setIsLoading] = useState(false);

      const data = row.original;

      const { productId, id } = data;

      const router = useRouter();

      // delete sku
      const submitDelete = async (skuId: string) => {
        setIsLoading(true);
        try {
          await DeleteProductSku({ skuId: id });

          toast.success(`Deleted sku: ${id}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error deleting sku");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <TableDropdown
          isLoading={isLoading}
          actionButton={"View Sku Details"}
          deleteData={{
            deleteId: id,
            deleteButton: "Delete Sku",
            onDelete: () => submitDelete(id),
          }}
          modalData={{
            modalTitle: `Confirm Deleting: SKU: ${data.id}`,
            modalContent:
              "  This action cannot be undone. Are you sure you want topermanently delete this SKU.",
            modalButton: "Confirm",
          }}
          navigateData={{
            navigatePath: `/dashboard/products/${productId}/${id}`,
            onNavigate: () =>
              router.push(`/dashboard/products/${productId}/${id}`),
          }}
        />
      );
    },
  },
];

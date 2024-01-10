"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";
// icons
import { MdOutlinePageview } from "react-icons/md";

type DashboardProducts = {
  id: string;
};

export const DashboardProductColumns: ColumnDef<DashboardProducts>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
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
      const data = row.original;

      const { id } = data;

      const router = useRouter();

      // JSX COMPONENT TO VIEW SKU
      return (
        <div className="rounded-full bg-gray-100 w-fit p-2 text-center">
          <MdOutlinePageview
            className="text-xl hover:scale-95 cursor-pointer"
            onClick={() => router.push(`/dashboard/products/${id}`)}
          />
        </div>
      );
    },
  },
];

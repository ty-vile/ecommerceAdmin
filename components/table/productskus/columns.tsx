"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";
// icons
import { MdOutlinePageview } from "react-icons/md";

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

      const { productId, id } = data;

      const router = useRouter();

      // JSX COMPONENT TO VIEW SKU
      return (
        <div
          className="rounded-full bg-gray-100 w-fit p-2 text-center"
          key={id}
        >
          <MdOutlinePageview
            className="text-xl hover:scale-95 cursor-pointer"
            // onClick={() => router.push(`/dashboard/products/${id}/`)}
            onClick={() => console.log(data)}
          />
        </div>
      );
    },
  },
];

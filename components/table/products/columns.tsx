"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";

type DashboardUsers = {};

export const DashboardProductColumns: ColumnDef<DashboardUsers>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "role",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      // JSX COMPONENT TO VIEW SKU
      return <div onClick={() => console.log(data)}>VIEW</div>;
    },
  },
];

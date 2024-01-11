"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// nextjs
import { useRouter } from "next/navigation";
import { useState } from "react";
// icons
import { FaEllipsisVertical } from "react-icons/fa6";
// shadcnui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// components
import { Button } from "@/components/ui/button";
// actions
import { DeleteProductSku } from "@/app/libs/api";
// toast
import { toast } from "react-toastify";

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
          const deletedSku = await DeleteProductSku({ skuId: id });

          toast.success(`Deleted sku: ${id}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error deleting sku");
        } finally {
          setIsLoading(false);
        }
      };

      // JSX COMPONENT TO VIEW SKU
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <FaEllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/products/${productId}/${id}`)
                }
              >
                View Sku
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="bg-red-600 text-white hover:bg-red-700 transition-300">
                  Delete Sku
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deleting: SKU: {data.id}</DialogTitle>
              <DialogDescription className="pt-2">
                This action cannot be undone. Are you sure you want to
                permanently delete this SKU.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-600 text-white hover:bg-red-700 transition-300"
                onClick={() => submitDelete(id)}
                disabled={isLoading}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

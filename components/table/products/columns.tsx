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

// toast
import { toast } from "react-toastify";
import { DeleteProduct } from "@/app/libs/api";

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
                onClick={() => router.push(`/dashboard/products/${id}`)}
              >
                View All Skus
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="bg-red-600 text-white hover:bg-red-700 transition-300">
                  Delete Product
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deleting: {name}</DialogTitle>
              <DialogDescription className="pt-2">
                This action cannot be undone. Are you sure you want to
                permanently delete this product.
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

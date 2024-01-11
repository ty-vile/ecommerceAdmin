"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
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
// icons
import { FaEllipsisVertical } from "react-icons/fa6";
// actions
import { DeleteUser, UpdateUserRole } from "@/app/libs/api";
// toast
import { toast } from "react-toastify";
// nextjs
import { useRouter } from "next/navigation";
import { useState } from "react";
// types
import { Role } from "@prisma/client";

type DashboardUsers = {
  name: string;
  email: string;
  role: Role;
};

export const DashboardUsersColumns: ColumnDef<DashboardUsers>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    accessorFn: (row) => row.role.toString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isLoading, setIsLoading] = useState(false);

      const user = row.original;

      const router = useRouter();

      // delete user
      const submitDelete = async (email: string) => {
        setIsLoading(true);
        try {
          const deletedUser = await DeleteUser({ email: email });

          toast.success(`Deleted user: ${deletedUser.name}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error deleting user");
        } finally {
          setIsLoading(false);
        }
      };

      // update user role
      const submitRoleChange = async (
        email: string,
        role: string,
        task: string
      ) => {
        setIsLoading(true);
        try {
          const data = { email, role, task };
          const updatedUser = await UpdateUserRole(data);
          toast.success(`${user.name}: Role - ${updatedUser.role}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error updating user");
        } finally {
          setIsLoading(false);
        }
      };

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
                onClick={() => submitRoleChange(user.email, user.role, "role")}
              >
                Change User Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="bg-red-600 text-white hover:bg-red-700 transition-300">
                  Delete User
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deleting: {user.name}</DialogTitle>
              <DialogDescription className="pt-2">
                This action cannot be undone. Are you sure you want to
                permanently delete this user.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-600 text-white hover:bg-red-700 transition-300"
                onClick={() => submitDelete(user.email)}
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

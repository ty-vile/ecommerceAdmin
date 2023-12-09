"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// components
import { Button } from "@/components/ui/button";
// icons
import { FaEllipsisVertical } from "react-icons/fa6";
// actions
import { DeleteUser, UpdateUserRole } from "@/app/libs/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const router = useRouter();

      const submitDelete = async (email: string) => {
        try {
          const deletedUser = await DeleteUser(email);

          toast.success(`Deleted user: ${deletedUser.name}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error deleting user");
        }
      };

      const submitRoleChange = async (email: string, role: string) => {
        try {
          const data = { email, role };

          const updatedUser = await UpdateUserRole(data);
          toast.success(`${user.name} now ${updatedUser.role}`);
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Error updating user");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaEllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => submitRoleChange(user.email, user.role)}
            >
              Change User Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => submitDelete(user.email)}
              className="bg-red-500 text-white hover:bg-red-600 transition-300"
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

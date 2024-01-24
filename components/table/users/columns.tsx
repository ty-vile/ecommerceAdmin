"use client";
// table
import { ColumnDef } from "@tanstack/react-table";
// actions
import { DeleteUser, UpdateUserRole } from "@/app/libs/api";
// toast
import { toast } from "react-toastify";
// nextjs
import { useRouter } from "next/navigation";
import { useState } from "react";
// types
import { Role } from "@prisma/client";
// components
import TableDropdown from "../table-dropdown";

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
        <TableDropdown
          isLoading={isLoading}
          actionButton={"Change User Role"}
          deleteData={{
            deleteId: user.email,
            deleteButton: "Delete User",
            onDelete: () => submitDelete(user.email),
          }}
          updateRole={{
            userRoleData: {
              id: user.email,
              role: user.role,
              task: "role",
            },
            onUpdateUserRole: () =>
              submitRoleChange(user.email, user.role, "role"),
          }}
          modalData={{
            modalTitle: `Confirm Deleting: ${user.name}`,
            modalContent:
              "This action cannot be undone. Are you sure you want to permanently delete this user.",
            modalButton: "Confirm",
          }}
        />
      );
    },
  },
];

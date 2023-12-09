import getAllUsers from "@/app/actions/getAllUsers";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { DataTable } from "@/components/table/data-table";
import { DashboardUsersColumns } from "@/components/table/users/columns";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div>
      {/* @ts-ignore */}
      <DataTable columns={DashboardUsersColumns} data={users} />
    </div>
  );
};

export default UsersPage;

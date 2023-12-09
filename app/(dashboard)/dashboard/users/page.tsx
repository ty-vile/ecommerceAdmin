// actions
import getAllUsers from "@/app/actions/getAllUsers";
import getCurrentUser from "@/app/actions/getCurrentUser";
// tables
import { DataTable } from "@/components/table/data-table";
import { DashboardUsersColumns } from "@/components/table/users/columns";
// types
import { Role } from "@prisma/client";
// nextjs
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="p-4">
      <h3 className="text-4xl font-bold pb-6">USERS ADMIN</h3>
      {/* @ts-ignore */}
      <div className="p-4 bg-white rounded-md">
        {/* @ts-ignore */}
        <DataTable columns={DashboardUsersColumns} data={users} />
      </div>
    </div>
  );
};

export default UsersPage;

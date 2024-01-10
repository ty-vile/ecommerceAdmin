// actions
import getAllUsers from "@/actions/users/getAllUsers";
import getCurrentUser from "@/actions/users/getCurrentUser";
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
    <div>
      <div className="p-6 bg-black text-white">
        <h1 className="text-4xl font-bold">USERS ADMIN</h1>
      </div>
      <div className="p-4 m-4 bg-white rounded-md">
        <DataTable
          columns={DashboardUsersColumns}
          data={users}
          searchValue={"name"}
        />
      </div>
    </div>
  );
};

export default UsersPage;

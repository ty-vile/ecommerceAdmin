import getAllUsers from "@/app/actions/getAllUsers";
import { DataTable } from "@/components/table/data-table";
import { DashboardUsersColumns } from "@/components/table/users/columns";

const UsersPage = async () => {
  const users = await getAllUsers();

  return (
    <div>
      {/* @ts-ignore */}
      <DataTable columns={DashboardUsersColumns} data={users} />
    </div>
  );
};

export default UsersPage;

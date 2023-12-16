// components
import Sidebar from "@/components/sidebar/sidebar";
// actions
import getCurrentUser from "@/actions/users/getCurrentUser";
// next
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <section className="w-screen h-screen flex overflow-hidden">
      <div className="w-3/12 max-w-xs">
        <Sidebar />
      </div>
      <div className="bg-gray-100 w-full">{children}</div>
    </section>
  );
}

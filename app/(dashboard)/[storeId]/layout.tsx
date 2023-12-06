// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
import getStore from "@/app/actions/stores/getStore";
// components
import Navbar from "@/components/navbar/navbar";
// next
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const currentUser = await getCurrentUser();
  const store = await getStore({
    storeId: params.storeId,
    userId: currentUser?.id,
  });

  if (!currentUser) {
    redirect("/sign-in");
  }

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

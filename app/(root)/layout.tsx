// next
import { redirect } from "next/navigation";
// actions
import getCurrentUser from "../actions/getCurrentUser";
import getStore from "../actions/stores/getStore";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const store = await getStore({
    userId: currentUser?.id,
  });

  if (!currentUser) {
    redirect("/sign-in");
  }

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}

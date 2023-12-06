import getCurrentUser from "@/app/actions/getCurrentUser";
import getStore from "@/app/actions/stores/getStore";
import { redirect } from "next/navigation";

type Props = {
  params: {
    storeId: string;
  };
};

const SettingsPage: React.FC<Props> = async ({ params }) => {
  const user = await getCurrentUser();

  const { id } = user!;

  if (!id) {
    redirect("/sign-in");
  }

  const store = await getStore({
    storeId: params.storeId,
    userId: id,
  });

  if (!store) {
    redirect("/");
  }

  return <div>{store.name}</div>;
};

export default SettingsPage;

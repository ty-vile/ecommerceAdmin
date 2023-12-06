// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
import getStore from "@/app/actions/stores/getStore";
import SettingsForm from "@/components/forms/settings-form";
// next
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

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* ADD PAGE HEADING + DELETE BUTTON HERE */}
        <SettingsForm data={store} />
      </div>
    </div>
  );
};

export default SettingsPage;

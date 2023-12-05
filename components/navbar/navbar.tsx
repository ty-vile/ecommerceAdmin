// components
import MainNav from "@/components/navbar/mainnav";
import UserMenu from "@/components/navbar/usermenu";
import StoreSwitcher from "@/components/ui/store-switcher";
// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
// navigation
import { redirect } from "next/navigation";
import getStores from "@/app/actions/stores/getStores";

const Navbar = async () => {
  const user = await getCurrentUser();

  const { id, name, email, image } = user!;

  if (!id) {
    redirect("/sign-in");
  }

  const stores = await getStores({
    userId: id,
  });

  console.log(stores);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>
          <StoreSwitcher className="" stores={stores} />
        </div>
        <MainNav />
        <div className="flex items-center space-x-4 ml-auto">
          <UserMenu id={id} name={name} email={email} image={image} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React from "react";
import MainNav from "@/components/navbar/mainnav";
import getCurrentUser from "@/app/actions/getCurrentUser";
import UserMenu from "@/components/navbar/usermenu";
import StoreSwitcher from "@/components/ui/store-switcher";

const Navbar = async () => {
  const user = await getCurrentUser();

  const { id, name, email, image } = user!;

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>
          <StoreSwitcher />
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

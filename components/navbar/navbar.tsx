import React from "react";
import MainNav from "./mainnav";
import getCurrentUser from "@/app/actions/getCurrentUser";
import UserMenu from "./usermenu";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>THIS WILL BE STORE SWITCHER</div>
        <MainNav />
        <div className="flex items-center space-x-4 ml-auto">
          <UserMenu
            id={user?.id!}
            name={user?.name!}
            email={user?.email!}
            image={user?.image}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

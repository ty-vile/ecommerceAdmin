// actions
import getCurrentUser from "@/actions/users/getCurrentUser";
// components
import SidebarItem from "@/components/sidebar/sidebar-item";
import { Button } from "../ui/button";
// icons
import { FaShoppingBag, FaUsers } from "react-icons/fa";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { Role } from "@prisma/client";

const EcommerceSidebarItems = [
  {
    label: "Products",
    icon: <FaShoppingBag className="text-2xl" />,
    href: "/dashboard/products",
  },
  {
    label: "Orders",
    icon: <BiSolidPurchaseTagAlt className="text-2xl" />,
    href: "/dashboard/orders",
  },
  {
    label: "Customers",
    icon: <FaUsers className="text-2xl" />,
    href: "/dashboard/customers",
  },
];

const AdminSidebarItems = [
  {
    label: "Settings",
    icon: <IoMdSettings className="text-2xl" />,
    href: "/dashboard/settings",
  },
  {
    label: "Users",
    icon: <FaUsersCog className="text-2xl" />,
    href: "/dashboard/users",
  },
  {
    label: "API",
    icon: <FaDatabase className="text-2xl" />,
    href: "/dashboard/api",
  },
];

const Sidebar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="fixed top-0 left-o h-screen flex flex-col justify-between p-4">
      {/* TOP SIDEBAR ITEMS */}
      <div className="flex flex-col">
        <h3 className="text-4xl pb-6 border-b-2 border-primary">
          Welcome back,
          <br />
          <span className="font-bold"> {currentUser?.name}</span>
        </h3>
        {/* ADMIN SIDEBAR ITEMS */}
        <div className="flex flex-col gap-4">
          <div className="mt-8">
            <h3>ECOMMERCE SETTINGS</h3>
          </div>
          <div className="flex flex-col gap-4">
            {EcommerceSidebarItems.map((item, i) => {
              return <SidebarItem item={item} key={i} />;
            })}
          </div>
        </div>
      </div>
      {/* END TOP SIDEBAR ITEMS */}
      {/* BOTTOM SIDEBAR ITEMS */}
      {currentUser?.role === Role.ADMIN && (
        <div className="flex flex-col gap-4">
          <div className="">
            <h3>ADMIN SETTINGS</h3>
          </div>
          <div className="flex flex-col gap-4">
            {AdminSidebarItems.map((item, i) => {
              return <SidebarItem item={item} key={i} />;
            })}
          </div>
          <Button className="w-full">View Store</Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

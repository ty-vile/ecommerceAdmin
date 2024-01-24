"use client";

// next
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  item: {
    label: string;
    icon: React.ReactNode;
    href: string;
  };
};

const SidebarItem = ({ item }: Props) => {
  const pathname = usePathname();
  let splitPathname = pathname.split("/");
  const isActive = splitPathname[2] === item.label.toLowerCase();

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-4 py-4 px-2 rounded-md hover:bg-primary hover:text-white transition-300
        ${isActive ? "bg-primary text-white" : ""}
      `}
    >
      {item.icon}
      <h4>{item.label}</h4>
    </Link>
  );
};

export default SidebarItem;

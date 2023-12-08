"use client";

import Link from "next/link";

type Props = {
  item: {
    label: string;
    icon: React.ReactNode;
    href: string;
  };
};

const SidebarItem = ({ item }: Props) => {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-4 py-4 px-2 rounded-md hover:bg-primary hover:text-white transition-300"
    >
      {item.icon}
      <h4>{item.label}</h4>
    </Link>
  );
};

export default SidebarItem;

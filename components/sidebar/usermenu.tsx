"use client";
import AvatarPlaceholderImage from "@/public/images.png";
// react
import Image from "next/image";
// dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// toast

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

const UserMenu: React.FC<Props> = ({ id, name, email, image }) => {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-out");
  };

  return (
    <div className="bg-background">
      <DropdownMenu>
        <DropdownMenuTrigger>
          {image ? (
            <Image
              src={image as string}
              alt="User Image"
              height={40}
              width={40}
              className="rounded-full"
            />
          ) : (
            <Image
              src={AvatarPlaceholderImage}
              alt="User Image"
              height={40}
              width={40}
              className="rounded-full"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute -right-6 ">
          <DropdownMenuLabel className="flex flex-col">
            <div className="text-xl font-bold">{name}</div>
            <div className="text-md">{email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSignOut()}
            className="cursor-pointer"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;

"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <div>
      <Button
        className="flex items-center gap-4 text-xl"
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;

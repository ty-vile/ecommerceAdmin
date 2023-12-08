"use client";

// next-auth
import { signOut } from "next-auth/react";
// components
import { Button } from "../../button";

const SignOutButton = () => {
  return (
    <>
      <Button
        className="flex items-center gap-4 text-xl"
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
      >
        Sign Out
      </Button>
    </>
  );
};

export default SignOutButton;

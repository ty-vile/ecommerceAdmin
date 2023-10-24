"use client";
// shadcnui
import { Button } from "@/components/ui/button";
// next-auth
import { signIn } from "next-auth/react";
// icons
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  return (
    <div>
      <Button
        className="flex items-center gap-4 text-xl"
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/sign-out" })}
      >
        <FcGoogle />
        Sign In
      </Button>
    </div>
  );
};

export default SignIn;

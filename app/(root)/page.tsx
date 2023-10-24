"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export default async function Home() {
  return (
    <div>
      <Button
        className="flex items-center gap-4 text-xl"
        variant="outline"
        onClick={() => signIn("google")}
      >
        Sign In
      </Button>
      <Button
        className="flex items-center gap-4 text-xl"
        variant="outline"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </div>
  );
}

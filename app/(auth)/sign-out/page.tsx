import getCurrentUser from "@/app/actions/getCurrentUser";
import SignOutButton from "@/components/ui/buttons/auth/sign-out-button";

import { redirect } from "next/navigation";

const SignOut = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <div>
      <SignOutButton />
    </div>
  );
};

export default SignOut;

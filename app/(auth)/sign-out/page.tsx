// actions
import getCurrentUser from "@/actions/users/getCurrentUser";
// components
import SignOutButton from "@/components/buttons/auth/sign-out-button";
// nextjs
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

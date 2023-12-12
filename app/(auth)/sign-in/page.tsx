// actions
import getCurrentUser from "@/app/actions/users/getCurrentUser";
// next
import { redirect } from "next/navigation";
// components
import SignInForm from "@/components/forms/auth/sign-in-form";

const SignIn = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/sign-out");
  }

  return (
    <div className="flex flex-col w-full max-w-lg space-y-4">
      <div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;

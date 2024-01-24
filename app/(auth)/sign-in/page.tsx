// actions
import getCurrentUser from "@/actions/users/getCurrentUser";
// next
import { redirect } from "next/navigation";
// components
import SignInForm from "@/app/(auth)/sign-in/components/forms/sign-in-form";

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

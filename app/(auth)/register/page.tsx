// actions
import getCurrentUser from "@/actions/users/getCurrentUser"; from "@/app/actions/users/getCurrentUser";
// components
import RegisterForm from "@/components/forms/auth/register-form";
import { redirect } from "next/navigation";

const Register = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/sign-out");
  }

  return (
    <div className="flex flex-col w-full max-w-lg">
      <div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;

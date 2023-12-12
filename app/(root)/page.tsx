// next
import { redirect } from "next/navigation";
// actions
import getCurrentUser from "../actions/users/getCurrentUser";

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  redirect("/dashboard");
};

export default HomePage;

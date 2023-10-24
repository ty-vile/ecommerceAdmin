import getCurrentUser from "../actions/getCurrentUser";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  console.log(currentUser);

  return <>{children}</>;
}

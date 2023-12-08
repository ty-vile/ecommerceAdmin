export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>{/* SIDEBAR */}</div>
      <div>{children}</div>
    </section>
  );
}

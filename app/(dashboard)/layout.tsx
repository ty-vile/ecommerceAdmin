import Sidebar from "@/components/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-screen h-screen flex">
      <div className="w-3/12 max-w-xs">
        <Sidebar />
      </div>
      <div className="bg-gray-100 w-full">{children}</div>
    </section>
  );
}

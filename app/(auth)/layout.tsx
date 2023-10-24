// next-js
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-screen h-screen bg-blue-50">
      <div className="w-full min-w-[500px] lg:w-4/12 flex items-center justify-center p-10">
        {children}
      </div>
      <div className="hidden lg:block lg:w-8/12 relative">
        <Image
          src="/authBg.jpg"
          fill
          alt="Auth Background Image"
          className="object-cover"
        />
      </div>
    </section>
  );
}

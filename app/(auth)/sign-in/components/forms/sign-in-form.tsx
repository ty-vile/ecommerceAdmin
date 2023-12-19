"use client";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// components
import { Input } from "@/components/ui/input";
import { Button } from "../../../../../components/ui/button";
// next-auth
import { signIn } from "next-auth/react";
// hooks
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.string().email({ message: "Must be valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(39, { message: "Password must be less then 40 characters" }),
});

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    signIn("credentials", { ...values, redirect: false }).then((callback) => {
      setIsLoading(false);

      if (!callback?.error) {
        router.refresh();
        router.push("/");
        toast.success("User signed in");
      }

      if (callback?.error) {
        toast.error(`Error signing in`);
      }
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Email"
                    type="text"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Password"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              className={`w-full ${isLoading && "bg-gray-100/70"}`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>
      </Form>
      <div>
        <Button
          className="flex items-center gap-4 w-full"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={isLoading}
        >
          Sign In
          <FcGoogle />
        </Button>
      </div>
    </section>
  );
};

export default SignInForm;

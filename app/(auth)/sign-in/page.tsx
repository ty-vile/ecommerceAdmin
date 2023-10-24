"use client";

// next-auth
import { signIn } from "next-auth/react";
// icons
import { FcGoogle } from "react-icons/fc";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// hooks
import { useForm } from "react-hook-form";
// shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Must be valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(39, { message: "Password must be less then 40 characters" }),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col w-full max-w-lg">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="flex flex-col space-y-8">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div className="pt-8">
              <Button className="w-full">Sign In</Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="pt-8">
        <Button
          className="flex items-center gap-4 w-full"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/sign-out" })}
        >
          Sign In
          <FcGoogle />
        </Button>
      </div>
    </div>
  );
};

export default SignIn;

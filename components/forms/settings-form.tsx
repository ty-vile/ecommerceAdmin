"use client";

import { useState } from "react";
// react-hook-form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// zod
import { z } from "zod";
// shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";

type Props = {
  data: Store;
};

const SettingsForm: React.FC<Props> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(39, { message: "Name must be less then 40 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const onSubmit = async () => {
    // UPDATE STORE NAME HERE - PATCH
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Name"
                  type="text"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button className={`w-full ${isLoading && "bg-gray-100/70"}`}>
            {isLoading ? "Registering User..." : "Register"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsForm;

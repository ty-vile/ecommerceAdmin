"use client";

// shadcnui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// icons
import { FaPlus } from "react-icons/fa";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// state
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// api
import { CreateCategory } from "@/app/libs/api";
// next
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(8, { message: "Category name must be at least 8 characters" })
    .max(50, "Category name must be less than 50 characters"),
});

const CreateCategoryPopover = () => {
  // form state
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const createCategory = CreateCategory(values);

      if (!createCategory) {
        setIsLoading(false);
        toast.error("Error creating category");
        return;
      }

      toast.success("Category sucessfully created");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <FaPlus />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 absolute -right-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Category Name"
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300 w-full ${
                  isLoading && "bg-gray-100/70"
                }`}
                disabled={isLoading}
              >
                <FaPlus />
                {isLoading ? "Creating Category..." : "Create Category"}
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CreateCategoryPopover;

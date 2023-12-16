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
import { Button } from "../../../ui/button";
// hooks
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

// api
import { CreateCategory } from "@/app/libs/api";
// types
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";

const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(20, "Category name must be less then 20 characters"),
});

const formSchema = z.object({
  categories: z.array(categorySchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
  categories: Category[] | [];
  formStep: number;
  setFormStep: (formStep: number) => void;
};

const CreateCategoryForm = ({ categories, formStep, setFormStep }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [{ name: "" }],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control,
  });

  const defaultCategory = {
    name: "",
  };

  // submit form
  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    try {
      for (const category of values.categories) {
        // CHECK IF CATEGORY ALREADY EXISTS IN DP
        const resultArray = categories?.filter(
          (categoryObj) => categoryObj.name === category.name
        );

        // IF CATEGORY DOES NOT EXIST
        if (resultArray.length === 1) {
          continue;
        }

        const createdProductCategory = await CreateCategory(category);

        if (!createdProductCategory) {
          toast.error("Error creating category");
          throw new Error("Error creating category");
        }
      }
      toast.success("Category successfully created");
      setFormStep(formStep);
      router.refresh();
    } catch (error) {
      console.error("Error in createProductWorkflow:", error);
      toast.error("An error occurred during product creation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create Categories</h2>
              <Button
                className="flex items-center gap-2 transition-300"
                onClick={() => setFormStep(formStep)}
              >
                <FaArrowLeftLong />
                Go back
              </Button>
            </div>
            {fields.map((field, index) => {
              return (
                <div key={index} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.name`}
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
                  {index > 0 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 transition-300"
                    >
                      Remove Category
                    </Button>
                  )}
                </div>
              );
            })}
            <Button type="button" onClick={() => append(defaultCategory)}>
              Add Category
            </Button>
          </div>

          <div>
            <Button
              className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300 w-full ${
                isLoading && "bg-gray-100/70"
              }`}
              disabled={isLoading}
            >
              <FaPlus />
              {isLoading ? "Creating Category..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateCategoryForm;

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
import { Button } from "@/components/ui/button";
// hooks
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FaArrowLeftLong } from "react-icons/fa6";
// api
import { CreateCategory } from "@/app/libs/api";
// types
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import CreateButton from "@/components/buttons/forms/create-button";
import DeleteButton from "@/components/buttons/forms/delete-button";

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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="mt-8 text-2xl font-bold border-l-4 border-blue-600 pl-4">
              Create Categories
            </h2>
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
              <div
                key={field.id}
                className="flex flex-col gap-4 bg-gray-50 p-4"
              >
                <h2 className="text-xl font-bold">Category {index + 1}</h2>
                <div className="flex items-end gap-4">
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
                    <DeleteButton
                      content="Remove Category"
                      deleteFunc={remove}
                      index={index}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-end">
            <Button type="button" onClick={() => append(defaultCategory)}>
              Add Category
            </Button>
          </div>

          <CreateButton
            isLoading={isLoading}
            content="Create Category"
            isLoadingContent="Creating Category"
          />
        </form>
      </Form>
    </>
  );
};

export default CreateCategoryForm;

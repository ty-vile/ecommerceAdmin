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
// types
import { ProductAttribute, ProductAttributeValue } from "@prisma/client";
import { Input } from "@/components/ui/input";

const productAttributeSchema = z.object({
  productAttribute: z
    .string()
    .min(3, "Attribute name must be at least 3 character")
    .max(20, "Attribute name must be less then 20 characters"),
  productAttributeValue: z
    .string()
    .min(1, "Attribute value must be at least 1 character")
    .max(20, "Attribute value must be less then 20 characters"),
});

const formSchema = z.object({
  attributes: z.array(productAttributeSchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
  attributes: ProductAttribute[] | [];
  attributeValues: ProductAttributeValue[] | [];
  formStep: number;
  setFormStep: (formStep: number) => void;
};

const CreateAttributeForm = ({ attributes, formStep, setFormStep }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attributes: [
        { productAttribute: undefined, productAttributeValue: undefined },
      ],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: "attributes",
    control,
  });

  const defaultAttribute = {
    productAttribute: "",
    productAttributeValue: "",
  };
  // submit form
  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    console.log(values);

    try {
      // for (const category of values.categories) {
      //   // CHECK IF CATEGORY ALREADY EXISTS IN DP
      //   const resultArray = categories?.filter(
      //     (categoryObj) => categoryObj.name === category.name
      //   );

      //   // IF CATEGORY DOES NOT EXIST
      //   if (resultArray.length === 1) {
      //     continue;
      //   }

      //   const createdProductCategory = await CreateCategory(category);

      //   if (!createdProductCategory) {
      //     toast.error("Error creating category");
      //     throw new Error("Error creating category");
      //   }
      // }
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create Attributes</h2>
            <Button
              className="flex items-center gap-2 transition-300"
              onClick={() => setFormStep(formStep)}
            >
              <FaArrowLeftLong />
              Go back
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => {
              return (
                <div key={index} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`attributes.${index}.productAttribute`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attribute Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Attribute Name"
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
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Remove Category
                    </Button>
                  )}
                </div>
              );
            })}
            <Button type="button" onClick={() => append(defaultAttribute)}>
              Add Attribute
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
              {isLoading ? "Creating Attribute..." : "Create Attribute"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateAttributeForm;

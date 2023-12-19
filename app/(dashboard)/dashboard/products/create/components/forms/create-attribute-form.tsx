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
// types
import { ProductAttribute, ProductAttributeValue } from "@prisma/client";
// components
import { Input } from "@/components/ui/input";
import DeleteButton from "@/components/buttons/forms/delete-button";
import CreateButton from "@/components/buttons/forms/create-button";
import NestedAttribute from "@/app/(dashboard)/dashboard/products/create/components/forms/nested-attribute";
// api
import { CreateAttribute, CreateAttributeValue } from "@/app/libs/api";

const productAtrtibuteValueSchema = z.object({
  name: z
    .string()
    .min(1, "Attribute value must be at least 1 character")
    .max(20, "Attribute value must be less then 20 characters"),
});

const productAttributeSchema = z.object({
  productAttribute: z
    .string()
    .min(3, "Attribute name must be at least 3 character")
    .max(20, "Attribute name must be less then 20 characters"),
  productAttributeValues: z.array(productAtrtibuteValueSchema),
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
        {
          productAttribute: "",
          productAttributeValues: [{ name: "" }],
        },
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
    productAttributeValues: [{ name: "" }],
  };

  // submit form
  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    try {
      for (const attribute of values.attributes) {
        const createdAttribute = await CreateAttribute({
          productAttribute: attribute.productAttribute,
        });

        if (!createdAttribute) {
          toast.error("Error creating product attributes");
          throw new Error("Error creating product attributes");
        }

        for (const attributeValue of attribute.productAttributeValues) {
          const attributeValueData = {
            name: attributeValue.name,
            productAttributeId: createdAttribute.id,
          };

          const createdAttributeValue = await CreateAttributeValue(
            attributeValueData
          );

          if (!createdAttributeValue) {
            toast.error("Error creating product attribute value");
            throw new Error("Error creating product attribute value");
          }
        }
      }

      toast.success("Attributes successfully created");
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
            <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">
              Create Attributes
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
                <h2 className="text-2xl font-bold">Attribute {index + 1}</h2>
                <div className="flex items-end gap-4">
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
                    <DeleteButton
                      content="Remove Attribute"
                      deleteFunc={remove}
                      index={index}
                    />
                  )}
                </div>
                <NestedAttribute
                  nestIndex={index}
                  control={control}
                  isLoading={isLoading}
                />
              </div>
            );
          })}
          <div className="flex items-center justify-end">
            <Button type="button" onClick={() => append(defaultAttribute)}>
              Add Attribute
            </Button>
          </div>

          <CreateButton
            isLoading={isLoading}
            content="Create Attribute"
            isLoadingContent="Creating Attribute"
          />
        </form>
      </Form>
    </>
  );
};

export default CreateAttributeForm;

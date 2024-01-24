"use client";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// react-hook-form
import { useForm, useFieldArray } from "react-hook-form";
// react-hooks
import React, { useState } from "react";
// toast
import { toast } from "react-toastify";
// component
import FormStep from "@/components/cards/form-step";
import MultistepForm from "@/components/forms/multistep/multistep-form";
// icons
import { SiGoogleforms } from "react-icons/si";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaBoxesPacking,
} from "react-icons/fa6";
import { FaImages } from "react-icons/fa";
import {
  Category,
  Product,
  ProductAttribute,
  ProductSku,
  ProductSkuPrice,
} from "@prisma/client";

interface UpdateProduct {
  product: Product;
  categories?: Category[];
  sku: ProductSku;
  price: ProductSkuPrice;
  attributes: ProductAttribute[];
  skuAttributes: {
    attributeName: string | undefined;
    attributeValueName: string | undefined;
  }[];
}

enum SKUFORMSTEP {
  OVERVIEW = 0,
  SKU = 1,
  IMAGES = 2,
}
// test
const productAttributeSchema = z.object({
  attributeName: z.string(),
  attributeValueName: z.string(),
});

const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(20, "Category name must be less then 20 characters"),
  id: z.string(),
});

const formSchema = z.object({
  name: z
    .string()
    .min(8, { message: "Product name must be at least 8 characters" })
    .max(50, "Product name must be less than 50 characters"),
  categories: z.array(categorySchema),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  image: z.any(),
  quantity: z.number().max(999999999, "Quantity must be less than 999999999"),
  price: z
    .number()
    .min(1, "Price must at least $1")
    .max(999999999, "Price must be less than $999999999"),
  attributes: z.array(productAttributeSchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductSkuForm = ({
  product,
  sku,
  categories,
  price,

  skuAttributes,
}: UpdateProduct) => {
  // form state
  const [formStep, setFormStep] = useState(SKUFORMSTEP.OVERVIEW);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product?.description,
      categories: categories,
      quantity: sku.quantity,
      price: price.price,
      attributes: skuAttributes,
    },
  });

  const { control } = form;

  const { fields: attributeFields } = useFieldArray({
    name: "attributes",
    control,
  });

  const { fields: categoryFields } = useFieldArray({
    name: "categories",
    control,
  });

  const multiStepContent = (
    <div className="flex justify-between gap-8">
      <div className="flex items-center gap-4 mb-8 w-9/12">
        <FormStep
          formStep={formStep}
          formStepValue={SKUFORMSTEP.OVERVIEW}
          content="Product Details"
        >
          <SiGoogleforms className="text-3xl" />
        </FormStep>
        <FormStep
          formStep={formStep}
          formStepValue={SKUFORMSTEP.SKU}
          content="SKU Details"
        >
          <FaBoxesPacking className="text-3xl" />
        </FormStep>
        <FormStep
          formStep={formStep}
          formStepValue={SKUFORMSTEP.IMAGES}
          content="Product Images"
        >
          <FaImages className="text-3xl" />
        </FormStep>
      </div>
      <div className="flex items-start gap-4 w-3/12">
        {/* <Button
          className={`flex items-center gap-2 w-full ${
            isLoading && "bg-gray-100/70"
          } ${"bg-red-500 hover:bg-red-600 text-white hover:text-white"}`}
          disabled={isLoading}
          type="button"
          variant="outline"
          onClick={() => onCancelEdit()}
        >
          <MdEditDocument />
          {isEditing ? "Cancel Edits" : "Edit SKU Details"}
        </Button>
        {isEditing && (
          <Button className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-700">
            <FaPlus /> Save Details
          </Button>
        )} */}
      </div>
    </div>
  );

  const formContent = (
    <>
      <Form {...form}>
        <form className="space-y-4">
          {formStep === SKUFORMSTEP.OVERVIEW && (
            <>
              <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4 mt-8">
                Product Details
              </h2>

              <div className="flex flex-col gap-4 bg-gray-50 p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input type="text" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between pt-8">
                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">
                  Product Categories
                </h2>
              </div>

              {categoryFields?.map((field, index) => {
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
                            <FormLabel>Product Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="No category found" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories &&
                                Array.isArray(categories) &&
                                categories.length > 0 ? (
                                  categories.map((category, i) => (
                                    <SelectItem value={category?.name} key={i}>
                                      {category?.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="nocategory" disabled>
                                    No categories
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {formStep === SKUFORMSTEP.SKU && (
            <>
              <h2 className="text-2xl font-bold">Unit Details</h2>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price</FormLabel>
                    <FormControl>
                      <Input type="text" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Quantity</FormLabel>
                    <FormControl>
                      <Input type="text" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">SKU Attributes</h2>
              </div>
              {attributeFields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-4 bg-gray-50 p-4"
                  >
                    <h2 className="text-2xl font-bold">
                      Attribute {index + 1}
                    </h2>
                    <div>
                      <div className="flex items-end gap-4">
                        <FormField
                          control={form.control}
                          name={`attributes.${index}.attributeName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Attribute {index + 1}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="No attribute found" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={field.value}>
                                    {field.value}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name={`attributes.${index}.attributeValueName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attribute Value {index + 1}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="No attribute found" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={field.value}>
                                {field.value}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </>
          )}

          <div>
            {formStep === SKUFORMSTEP.OVERVIEW && (
              <Button
                className={`flex items-center gap-2  w-full`}
                type="button"
                onClick={() => setFormStep(SKUFORMSTEP.SKU)}
              >
                <FaArrowRightLong />
                Next Step
              </Button>
            )}
            {formStep === SKUFORMSTEP.SKU && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className={`flex items-center gap-2  w-full`}
                  type="button"
                  onClick={() => setFormStep(SKUFORMSTEP.OVERVIEW)}
                >
                  <FaArrowLeftLong />
                  Previous Step
                </Button>
                <Button
                  className={`flex items-center gap-2  w-full`}
                  type="button"
                  onClick={() => setFormStep(SKUFORMSTEP.IMAGES)}
                >
                  <FaArrowRightLong />
                  Next Step
                </Button>
              </div>
            )}
            {formStep === SKUFORMSTEP.IMAGES && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className={`flex items-center gap-2  w-full`}
                  type="button"
                  onClick={() => setFormStep(SKUFORMSTEP.SKU)}
                >
                  <FaArrowLeftLong />
                  Previous Step
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </>
  );

  return (
    <>
      <MultistepForm
        multiStepData={{
          content: multiStepContent,
          formStep: formStep,
        }}
        formData={{
          form: form,
          content: formContent,
        }}
      />
    </>
  );
};

export default ProductSkuForm;

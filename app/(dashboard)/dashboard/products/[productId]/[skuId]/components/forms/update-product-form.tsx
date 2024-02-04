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
import React, { useState, useTransition } from "react";
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
  ProductImage,
  ProductSku,
  ProductSkuPrice,
} from "@prisma/client";

import {
  CreateProductImage,
  CreateProductSkuPrice,
  PatchProductSku,
} from "@/app/libs/api";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface UpdateProduct {
  product: Product;
  productImage?: ProductImage[];
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
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(999999999, "Quantity must be less than 999999999"),
  price: z
    .number()
    .min(1, "Price must at least $1")
    .max(999999999, "Price must be less than $999999999"),
  attributes: z.array(productAttributeSchema),
});

const updatePriceFormSchema = z.object({
  price: z
    .string()
    .min(1, "Price must at least $1")
    .max(999999999, "Price must be less than $999999999"),
  skuId: z.string(),
});

const updateQuantityFormSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity must be at least 1")
    .max(999999999, "Quantity must be less than 999999999"),
  skuId: z.string(),
});

type ProductFormValues = z.infer<typeof formSchema>;
type UpdatePriceFormValues = z.infer<typeof updatePriceFormSchema>;
type UpdateQuantityFormValues = z.infer<typeof updateQuantityFormSchema>;

const ProductSkuForm = ({
  product,
  sku,
  categories,
  price,
  skuAttributes,
  productImage,
}: UpdateProduct) => {
  const [formStep, setFormStep] = useState(SKUFORMSTEP.OVERVIEW);
  const [isLoading, setIsLoading] = useState(false);

  const [priceUpdateOpen, setPriceUpdateOpen] = useState(false);
  const [quantityUpdateOpen, setQuantityUpdateOpen] = useState(false);

  const router = useRouter();

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

  const updatePriceForm = useForm<UpdatePriceFormValues>({
    resolver: zodResolver(updatePriceFormSchema),
    defaultValues: {
      price: "",
      skuId: sku.id,
    },
  });

  const updateQuantityForm = useForm<UpdateQuantityFormValues>({
    resolver: zodResolver(updateQuantityFormSchema),
    defaultValues: {
      quantity: "",
      skuId: sku.id,
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

  const onUpdatePriceSubmit = async (values: UpdatePriceFormValues) => {
    setIsLoading(true);

    try {
      const priceData = {
        price: Number(values.price),
        skuId: values.skuId,
      };
      const newPrice = await CreateProductSkuPrice(priceData);

      if (newPrice) {
        setPriceUpdateOpen(false);
        toast.success("Price updated sucesfully");
      }

      window.location.reload();
    } catch (error) {
      toast.error("Error updating price");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateQuantitySubmit = async (values: UpdateQuantityFormValues) => {
    try {
      const quantityData = {
        quantity: Number(values.quantity),
        skuId: values.skuId,
      };
      const updatedQuantity = await PatchProductSku(quantityData);

      if (updatedQuantity) {
        setQuantityUpdateOpen(false);
        toast.success("Quantity updated sucesfully");
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Error updating quantity");
      console.error(error);
    }
  };

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
        <Dialog open={priceUpdateOpen} onOpenChange={setPriceUpdateOpen}>
          <DialogTrigger className="w-full" asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 transition-300">
              Update Price
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Update SKU Price</DialogTitle>
              <Form {...updatePriceForm}>
                <form
                  onSubmit={updatePriceForm.handleSubmit(onUpdatePriceSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={updatePriceForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SKU Price"
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
                    className="bg-green-600 text-white hover:bg-green-700 transition-300"
                    disabled={isLoading}
                  >
                    Confirm Update
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={quantityUpdateOpen} onOpenChange={setQuantityUpdateOpen}>
          <DialogTrigger className="w-full" asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 transition-300">
              Update Quantity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Update SKU Quantity</DialogTitle>
              <Form {...updateQuantityForm}>
                <form
                  onSubmit={updateQuantityForm.handleSubmit(
                    onUpdateQuantitySubmit
                  )}
                  className="space-y-8"
                >
                  <FormField
                    control={updateQuantityForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Quantity</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SKU Quantity"
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
                    className="bg-green-600 text-white hover:bg-green-700 transition-300"
                    disabled={isLoading}
                  >
                    Confirm Update
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
              <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4 mt-8">
                Unit Details
              </h2>

              <div className="flex flex-col gap-4 bg-gray-50 p-4">
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
              </div>
              <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4 mt-8">
                SKU Attributes
              </h2>
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
                                disabled
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
                            disabled
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
          {formStep === SKUFORMSTEP.IMAGES && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-10">
                {productImage &&
                  productImage?.map((image, i) => {
                    return (
                      <div
                        key={i}
                        className="flex flex-col gap-4 group relative transition-300"
                      >
                        <Image
                          src={image.url as string}
                          alt="Product Image"
                          height={0}
                          width={0}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    );
                  })}
              </div>
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

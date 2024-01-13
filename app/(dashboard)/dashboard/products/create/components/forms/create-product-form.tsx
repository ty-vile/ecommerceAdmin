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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormStep from "@/components/cards/form-step";

import CreateButton from "@/components/buttons/forms/create-button";
import DeleteButton from "@/components/buttons/forms/delete-button";
import ImageUpload from "@/components/image/image-upload";
import MultistepForm from "@/components/forms/multistep/multistep-form";
// hooks
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FaShoppingBag, FaImages, FaPlus } from "react-icons/fa";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaBoxesPacking,
} from "react-icons/fa6";

// api
import {
  CreateCategory,
  CreateProduct,
  CreateProductSku,
  CreateProductCategoryJoin,
  CreateProductImage,
  CreateProductSkuPrice,
} from "@/app/libs/api";
// types
import { Category } from "@prisma/client";
// functions
import {
  generateSHA256,
  generateSKUCode,
  toggleFormStep,
} from "@/app/libs/functions";
import { getSignedS3Url } from "@/lib/s3";
import NestedProductAttribute from "../nested/nested-product-attribute";

enum PRODUCTFORMSTEP {
  PRODUCT = 0,
  SKU = 1,
  IMAGES = 2,
  CREATECATEGORY = 3,
  CREATEATTRIBUTE = 4,
}

const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(20, "Category name must be less then 20 characters"),
});

const productAtrtibuteValueSchema = z.object({
  name: z
    .string()
    .min(1, "Attribute value must be at least 1 character")
    .max(20, "Attribute value must be less then 20 characters"),
});

const productAttributeSchema = z.object({
  productAttribute: z.string(),
  productAttributeValues: z.array(productAtrtibuteValueSchema),
});

const formSchema = z.object({
  name: z
    .string()
    .min(8, { message: "Product name must be at least 8 characters" })
    .max(50, "Product name must be less than 50 characters"),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  categories: z.array(categorySchema),
  quantity: z
    .string()
    .min(1, "Quantity must be at least 1")
    .max(999999999, "Quantity must be less than 999999999"),
  price: z
    .string()
    .min(1, "Price must at least $1")
    .max(999999999, "Price must be less than $999999999"),
  attributes: z.array(productAttributeSchema),
  image: z.any(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
  categories: Category[] | [];
  attributes: {
    id: string;
    name: string;
    productAttributeValues?: {
      id: string;
      name: string;
      hexCode: string | null;
      productAttributeId: string;
    }[];
  }[];
};

const CreateProductForm = ({ categories, attributes }: Props) => {
  // form state
  const [formStep, setFormStep] = useState(PRODUCTFORMSTEP.PRODUCT);
  const [isLoading, setIsLoading] = useState(false);
  // file state

  const [files, setFiles] = useState<any[]>([]);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: [{ name: "" }],
      quantity: "",
      price: "",
      attributes: [
        {
          productAttribute: "",
          productAttributeValues: [{ name: "" }],
        },
      ],
    },
  });

  const {
    control,
    formState: { errors },
    trigger,
  } = form;

  const {
    fields: categoryFields,
    append: categoryAppend,
    remove: categoryRemove,
  } = useFieldArray({
    name: "categories",
    control,
  });

  const {
    fields: attributeFields,
    append: attributeAppend,
    remove: attributeRemove,
  } = useFieldArray({
    name: "attributes",
    control,
  });

  const defaultCategory = {
    name: "",
  };

  const defaultAttribute = {
    productAttribute: "",
    productAttributeValues: [{ name: "" }],
  };

  // generates local urls of images to preview on frontend when files state is updated
  useEffect(() => {
    if (files) {
      const fileUrlArr = [];

      for (let i = 0; i < files.length; i++) {
        const url = URL.createObjectURL(files[i]);

        fileUrlArr.push(url);
      }

      setFileUrls(fileUrlArr);
    }
  }, [files]);

  // submit form
  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    try {
      const createdProduct = await CreateProduct(values);

      if (!createdProduct) {
        toast.error("Error creating product");
        throw new Error("Error creating product");
      }

      for (const category of values.categories) {
        // CHECK IF CATEGORY ALREADY EXISTS IN DP
        const resultArray = categories?.filter(
          (categoryObj) => categoryObj.name === category.name
        );

        // IF CATEGORY DOES NOT EXIST
        if (resultArray.length === 0) {
          const createdProductCategory = await CreateCategory(category);

          if (!createdProductCategory) {
            toast.error("Error creating category");
            throw new Error("Error creating category");
          }

          const joinData = {
            productId: createdProduct.id,
            categoryId: createdProductCategory.id,
            createdByUser: createdProduct.userId,
          };

          const createdProductCategoryJoin = await CreateProductCategoryJoin(
            joinData
          );

          if (!createdProductCategoryJoin) {
            toast.error("Error joining category with product");
            throw new Error("Error joining category with product");
          }
        } else {
          // IF CATEGORY DOES EXIST
          const matchingCategory = resultArray[0];

          const joinData = {
            productId: createdProduct.id,
            categoryId: matchingCategory.id,
            createdByUser: createdProduct.userId,
          };

          const createdProductCategoryJoin = await CreateProductCategoryJoin(
            joinData
          );

          if (!createdProductCategoryJoin) {
            toast.error("Error joining category with product");
            throw new Error("Error joining category with product");
          }
        }
      }

      const createdSkuCode = await generateSKUCode(createdProduct.name);

      if (!createdSkuCode) {
        toast.error("Error generating SKU code");
        throw new Error("Error generating SKU code");
      }

      const skuData = {
        productId: createdProduct.id,
        sku: createdSkuCode,
        quantity: values.quantity,
      };

      const createdProductSku = await CreateProductSku(skuData);

      if (!createdProductSku) {
        toast.error("Error creating product SKU");
        throw new Error("Error creating product SKU");
      }

      // NOTES - ADD PRODUCT SKU PRICE
      const skuPriceData = {
        skuId: createdProductSku.id,
        price: Number(values.price),
      };

      const createdProductSkuPrice = await CreateProductSkuPrice(skuPriceData);

      if (!createdProductSkuPrice) {
        toast.error("Error creating product SKU price");
        throw new Error("Error creating product SKU price");
      }

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const checkSum = await generateSHA256(files[i]);
          const { signedS3Url, productImageData } = await getSignedS3Url(
            createdProductSku.sku,
            files[i].type,
            files[i].size,
            checkSum,
            createdProductSku.sku
          );

          if (!signedS3Url) {
            throw new Error("Error creating S3 URL");
          }
          const url = signedS3Url;
          const repsone = await fetch(url, {
            method: "PUT",
            body: files[i],
            headers: {
              "Content-Type": files[i].type,
            },
          });
          const createdProductImage = await CreateProductImage(
            productImageData
          );

          if (!createdProductImage) {
            toast.error("Error creating product imagee");
            throw new Error("Error creating product imagee");
          }
        }
      }

      toast.success("Product successfully created");
      router.push(
        `/dashboard/products/${createdProduct.id}/${createdProductSku.id}`
      );
    } catch (error) {
      console.error("Error in createProductWorkflow:", error);
      toast.error("An error occurred during product creation");
    } finally {
      setIsLoading(false);
    }
  };

  const multiStepContent = (
    <div className="flex items-center gap-4">
      <FormStep
        formStep={formStep}
        formStepValue={PRODUCTFORMSTEP.PRODUCT}
        content="Product Details"
      >
        <FaShoppingBag className="text-3xl" />
      </FormStep>
      <FormStep
        formStep={formStep}
        formStepValue={PRODUCTFORMSTEP.SKU}
        content="Product Attributes"
      >
        <FaBoxesPacking className="text-3xl" />
      </FormStep>
      <FormStep
        formStep={formStep}
        formStepValue={PRODUCTFORMSTEP.IMAGES}
        content="Product Images"
      >
        <FaImages className="text-3xl" />
      </FormStep>
    </div>
  );

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formStep === PRODUCTFORMSTEP.PRODUCT && (
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
                      <Input
                        placeholder="Enter Product Name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Product Description"
                        disabled={isLoading}
                        {...field}
                      />
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
              <Button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300"
                onClick={() => setFormStep(PRODUCTFORMSTEP.CREATECATEGORY)}
              >
                <FaPlus />
                Create category
              </Button>
            </div>

            {categoryFields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 bg-gray-50 p-4"
                >
                  <h2 className="text-xl font-bold">Category {index + 1}</h2>
                  <div className="flex items-end gap-4">
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`categories.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product category" />
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
                    {index > 0 && (
                      <DeleteButton
                        content="Remove Category"
                        deleteFunc={categoryRemove}
                        index={index}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-end">
              <Button
                type="button"
                className="w-fit"
                onClick={() => categoryAppend(defaultCategory)}
              >
                Add Category
              </Button>
            </div>
          </>
        )}
        {formStep === PRODUCTFORMSTEP.SKU && (
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
                    <FormLabel>Product Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Product Price"
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Quantity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Stock Quantity"
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between pt-8">
              <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">
                SKU Attributes
              </h2>
              <Button
                variant="create"
                onClick={() => setFormStep(PRODUCTFORMSTEP.CREATEATTRIBUTE)}
              >
                <FaPlus />
                Create attribute
              </Button>
            </div>

            {attributeFields.map((field, index) => {
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
                              {attributes &&
                              Array.isArray(attributes) &&
                              attributes.length > 0 ? (
                                attributes.map((attribute, i) => (
                                  <SelectItem value={attribute.id} key={i}>
                                    {attribute?.name}
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
                    {index > 0 && (
                      <DeleteButton
                        content="Remove Attribute"
                        deleteFunc={attributeRemove}
                        index={index}
                      />
                    )}
                  </div>
                  <NestedProductAttribute
                    nestIndex={index}
                    control={control}
                    isLoading={isLoading}
                    productAttributeId={form.watch(
                      `attributes.${index}.productAttribute`
                    )}
                    attributes={attributes}
                  />
                </div>
              );
            })}
            <div className="flex items-center justify-end">
              <Button
                type="button"
                className="w-fit"
                onClick={() => attributeAppend(defaultAttribute)}
              >
                Add Attribute
              </Button>
            </div>
          </>
        )}
        {formStep === PRODUCTFORMSTEP.IMAGES && (
          <>
            <ImageUpload
              files={files}
              filesUrl={filesUrl}
              isLoading={isLoading}
              form={form}
              setFiles={setFiles}
            />
          </>
        )}
        <div>
          {formStep === PRODUCTFORMSTEP.PRODUCT && (
            <Button
              className={`flex items-center gap-2  w-full`}
              type="button"
              onClick={() =>
                toggleFormStep(
                  trigger,
                  "next",
                  PRODUCTFORMSTEP.PRODUCT,
                  setFormStep,
                  ["name", "description"]
                )
              }
            >
              <FaArrowRightLong />
              Next Step
            </Button>
          )}
          {formStep === PRODUCTFORMSTEP.SKU && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={`flex items-center gap-2  w-full`}
                type="button"
                onClick={() =>
                  toggleFormStep(
                    trigger,
                    "previous",
                    PRODUCTFORMSTEP.SKU,
                    setFormStep
                  )
                }
              >
                <FaArrowLeftLong />
                Previous Step
              </Button>
              <Button
                className={`flex items-center gap-2  w-full`}
                type="button"
                onClick={() =>
                  toggleFormStep(
                    trigger,
                    "next",
                    PRODUCTFORMSTEP.SKU,
                    setFormStep,
                    ["price", "quantity"]
                  )
                }
              >
                <FaArrowRightLong />
                Next Step
              </Button>
            </div>
          )}
          {formStep === PRODUCTFORMSTEP.IMAGES && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={`flex items-center gap-2  w-full`}
                type="button"
                onClick={() =>
                  toggleFormStep(
                    trigger,
                    "previous",
                    PRODUCTFORMSTEP.IMAGES,
                    setFormStep
                  )
                }
              >
                <FaArrowLeftLong />
                Previous Step
              </Button>
              <CreateButton
                isLoading={isLoading}
                content="Create Product"
                isLoadingContent="Creating Product"
              />
            </div>
          )}
        </div>
      </form>
    </Form>
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

export default CreateProductForm;

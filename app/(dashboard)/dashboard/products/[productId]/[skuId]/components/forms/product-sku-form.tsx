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
import React, { useEffect, useState } from "react";
// toast
import { toast } from "react-toastify";
// functions
import { generateSHA256 } from "@/app/libs/functions";
// aws
import { getSignedS3Url } from "@/lib/s3";
// component
import FormStep from "@/components/cards/form-step";
import ImageUpload from "@/components/image/image-upload";
// api
import { CreateProductImage } from "@/app/libs/api";
// types
import {
  Category,
  Product,
  ProductAttribute,
  ProductAttributeSku,
  ProductImage,
  ProductSku,
} from "@prisma/client";
// icons
import { SiGoogleforms } from "react-icons/si";
import { FaBoxesPacking } from "react-icons/fa6";
import { FaImages, FaPlus } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import CreateCategoryForm from "../../../../create/components/forms/create-category-form";
import CreateAttributeForm from "../../../../create/components/forms/create-attribute-form";
import DeleteButton from "@/components/buttons/forms/delete-button";

type Props = {
  product: {
    id: string;
    userId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    // categories?: {
    //   category: {
    //     id: string;
    //     name: string;
    //   };
    // }[];
  };
  productCategories?: {
    name: string;
    id?: string;
  }[];
  sku:
    | {} & {
        id: string;
        sku: string;
        productId: string;
        quantity: number;
        isDefault: boolean;
      };
};

enum SKUFORMSTEP {
  OVERVIEW = 0,
  SKU = 1,
  IMAGES = 2,
  CREATEATTRIBUTE = 3,
  CREATECATEGORY = 4,
}

const productAttributeSchema = z.object({
  productAttribute: z.string(),
  productAttributeValue: z.string(),
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

const ProductSkuForm = ({ product, sku, productCategories }: Props) => {
  // form state
  const [formStep, setFormStep] = useState(SKUFORMSTEP.OVERVIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // file state
  const [files, setFiles] = useState<any[]>([]);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);

  const formStepLen = 3;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product?.description,
      categories: productCategories,
      quantity: sku.quantity,
      // price: sku.price,
      attributes: [
        { productAttribute: undefined, productAttributeValue: undefined },
      ],
    },
  });

  const { control } = form;

  const {
    fields: fieldsAttribute,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    name: "attributes",
    control,
  });

  const {
    fields: categoryFields,
    append: categoryAppend,
    remove: categoryRemove,
  } = useFieldArray({
    name: "categories",
    control,
  });

  const defaultAttribute = {
    productAttribute: "",
    productAttributeValue: "",
  };

  const defaultCategory = {
    name: "",
    id: "",
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

  const onSubmit = async () => {};

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Textarea disabled={!isEditing} {...field} />
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
                {/* <Button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300"
                  onClick={() => setFormStep(SKUFORMSTEP.CREATECATEGORY)}
                >
                  <FaPlus />
                  Create category
                </Button> */}
              </div>

              {/* MAP OVER CATEGORIES HERE AND RETURN FIELDS */}

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
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="No category found" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productCategories &&
                                Array.isArray(productCategories) &&
                                productCategories.length > 0 ? (
                                  productCategories.map((category, i) => (
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
                      <Input type="text" disabled={!isEditing} {...field} />
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
                      <Input type="text" disabled={!isEditing} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">SKU Attributes</h2>
                <Button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300"
                  onClick={() => setFormStep(SKUFORMSTEP.CREATEATTRIBUTE)}
                >
                  <FaPlus />
                  Create attribute
                </Button>
              </div>
              {fieldsAttribute.map((field, index) => {
                return (
                  <div key={field.id}>
                    <FormField
                      control={form.control}
                      name={`attributes.${index}.productAttribute`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Attribute</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="No attributes found" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>No attributes found</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeAttribute(index)}
                      >
                        Remove Attribute
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button
                type="button"
                onClick={() => appendAttribute(defaultAttribute)}
              >
                Add Attribute
              </Button>
            </>
          )}
          {formStep === SKUFORMSTEP.IMAGES && (
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
            <Button
              className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300 w-full ${
                isLoading && "bg-gray-100/70"
              }`}
              disabled={isLoading}
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
            >
              <MdEditDocument />
              {isEditing ? "Cancel SKU" : "Edit SKU"}
            </Button>
            {/* {isEditing && (
              <Button
                className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300 w-full ${
                  isLoading && "bg-gray-100/70"
                }`}
                disabled={isLoading}
                type="submit"
              >
                <FaPlus />
                {isLoading ? "Creating Product..." : "Create Product"}
              </Button>
            )} */}
          </div>
        </form>
      </Form>

      {formStep === SKUFORMSTEP.CREATEATTRIBUTE && (
        <>
          <CreateAttributeForm
            formStep={SKUFORMSTEP.SKU}
            setFormStep={setFormStep}
            attributes={[]}
            attributeValues={[]}
          />
        </>
      )}
    </>
  );
};

export default ProductSkuForm;

// http://localhost:3000/dashboard/products/clq7iidds0001ln8dfsj4egq0/clq7iie640004ln8d6lva29q7

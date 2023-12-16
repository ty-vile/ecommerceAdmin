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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../../../ui/button";
import FormStep from "@/components/cards/form-step";
// hooks
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FaShoppingBag, FaImages, FaPlus } from "react-icons/fa";
import { FaBoxesPacking } from "react-icons/fa6";
// api
import {
  CreateCategory,
  CreateProduct,
  CreateProductSku,
  CreateProductCategoryJoin,
} from "@/app/libs/api";
// types
import { Category, Product, ProductSku } from "@prisma/client";
// functions
import { generateSKUCode } from "@/app/libs/functions";
import CreateCategoryForm from "../category/create-category-form";

enum PRODUCTFORMSTEP {
  PRODUCT = 0,
  SKU = 1,
  IMAGES = 2,
  CREATECATEGORY = 3,
}

const categorySchema = z.object({
  name: z.string().min(4, "Category name must be at least 4 characters"),
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
});

type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
  categories: Category[] | [];
};

const CreateProductForm = ({ categories }: Props) => {
  // form state
  const [formStep, setFormStep] = useState(PRODUCTFORMSTEP.PRODUCT);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
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
      };

      const createdProductSku = await CreateProductSku(skuData);

      if (!createdProductSku) {
        toast.error("Error creating product SKU");
        throw new Error("Error creating product SKU");
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

  return (
    <section className="flex flex-col gap-4">
      {formStep !== PRODUCTFORMSTEP.CREATECATEGORY && (
        <>
          <div className="flex items-center gap-4 mb-8">
            <FormStep
              formStep={formStep}
              formStepValue={PRODUCTFORMSTEP.PRODUCT}
              stepNumber={1}
              setFormStep={setFormStep}
              content="Product Overview"
            >
              <FaShoppingBag className="text-3xl" />
            </FormStep>
            <FormStep
              formStep={formStep}
              formStepValue={PRODUCTFORMSTEP.SKU}
              stepNumber={2}
              setFormStep={setFormStep}
              content="Product Attributes"
            >
              <FaBoxesPacking className="text-3xl" />
            </FormStep>
            <FormStep
              formStep={formStep}
              formStepValue={PRODUCTFORMSTEP.IMAGES}
              stepNumber={3}
              setFormStep={setFormStep}
              content="Product Images"
            >
              <FaImages className="text-3xl" />
            </FormStep>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-2xl font-bold">Product Details</h2>
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Categories</h2>
                <Button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300"
                  onClick={() => setFormStep(PRODUCTFORMSTEP.CREATECATEGORY)}
                >
                  <FaPlus />
                  Create category
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {fields.map((field, index) => {
                  return (
                    <div key={index} className="flex items-end gap-4">
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
                        <Button type="button" onClick={() => remove(index)}>
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
                  {isLoading ? "Creating Product..." : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {formStep === PRODUCTFORMSTEP.CREATECATEGORY && (
        <>
          <CreateCategoryForm
            formStep={PRODUCTFORMSTEP.PRODUCT}
            setFormStep={setFormStep}
            categories={categories}
          />
        </>
      )}
    </section>
  );
};

export default CreateProductForm;

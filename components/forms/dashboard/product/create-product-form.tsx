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
// shadcnui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../../../ui/button";
// hooks
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// toast
import { toast } from "react-toastify";
// icons
import { FaPlus } from "react-icons/fa";
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

const formSchema = z.object({
  name: z
    .string()
    .min(8, { message: "Product name must be at least 8 characters" })
    .max(50, "Product name must be less than 50 characters"),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  category: z
    .string()
    .min(3, { message: "Category must be at least 3 characters" })
    .max(50, "Category name must be less than 50 characters"),
});

type Props = {
  categories: Category | Category[] | null;
};

const CreateProductForm = ({ categories }: Props) => {
  // form state
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  // submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // ADD PRODUCT - SKU - ATTRIBUTE - ATTRIBUTE VALUE TO DB

    let product: Product;
    let productCategory: Category;
    let productSku: ProductSku;

    CreateProduct(values)
      .then((createdProduct) => {
        product = createdProduct;

        if (!product) {
          toast.error("Error creating product");
          return Promise.reject("Error creating product");
        }

        return CreateCategory(values);
      })
      .then((createdProductCategory) => {
        productCategory = createdProductCategory;

        if (!productCategory) {
          toast.error("Error creating category");
          return Promise.reject("Error creating category");
        }

        const joinData = {
          productId: product.id,
          categoryId: productCategory.id,
          createdByUser: product.userId,
        };

        return CreateProductCategoryJoin(joinData);
      })
      .then((productCategoryJoin) => {
        if (!productCategoryJoin) {
          toast.error("Error joining category with product");
          return Promise.reject("Error joining category with product");
        }

        return generateSKUCode(product.name, productCategory.name);
      })
      .then((skuCode) => {
        if (!skuCode) {
          toast.error("Error generating SKU code");
          return Promise.reject("Error generating SKU code");
        }

        const skuData = {
          productId: product.id,
          sku: skuCode,
        };

        return CreateProductSku(skuData);
      })
      .then((createdProductSku) => {
        productSku = createdProductSku;

        if (!createdProductSku) {
          toast.error("Error creating product SKU");
          return Promise.reject("Error creating product SKU");
        }
      })
      .finally(() => {
        setIsLoading(false);
        toast.success("Product sucessfully created");
        router.push(`/dashboard/products/${product.id}/${productSku.id}`);
      });
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="category"
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
            <div className="flex justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <FaPlus />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 absolute -right-6">
                  <FormField
                    control={form.control}
                    name="category"
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
                </PopoverContent>
              </Popover>
            </div>
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
    </section>
  );
};

export default CreateProductForm;

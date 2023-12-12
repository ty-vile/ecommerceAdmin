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
import { Button } from "../../ui/button";
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
  ProductCategoryJoin,
} from "@/app/libs/api";
// types
import { Category, Product, ProductSku } from "@prisma/client";
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
  categories: Category[];
};

const CreateProductForm = ({ categories }: Props) => {
  // form state
  const [isLoading, setIsLoading] = useState(false);
  // file state
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);
  // progress-bar state

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  // generates local urls of images to preview on frontend when files state is updated
  useEffect(() => {
    if (filesUrl.length > 0) {
      setFileUrls([]);
    }

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

        return ProductCategoryJoin(joinData);
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
        toast.success("Product sucessfully created");
        router.push(`/dashboard/products/${product.id}/${productSku.id}`);
      });

    try {
      //   if (files) {
      //     for (let i = 0; i < files.length; i++) {
      //       const checkSum = await generateSHA256(files[i]);
      //       const signedS3Url = await getSignedS3Url(
      //         // replace test file with product-name/sku
      //         `test-file-${i}`,
      //         files[i].type,
      //         files[i].size,
      //         checkSum
      //       );
      //       if (!signedS3Url) {
      //         throw new Error("Error creating S3 URL");
      //       }
      //       const url = signedS3Url;
      //       const response = await fetch(url, {
      //         method: "PUT",
      //         body: files[i],
      //         headers: {
      //           "Content-Type": files[i].type,
      //         },
      //       });
      //       if (response.ok) {
      //         // upload image to db
      //       }
      //     }
      //   }
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle file change - input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localFiles = e.target.files;

    if (localFiles) {
      setFiles(localFiles);
    }
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
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Image(s)</FormLabel>
                <FormControl>
                  <Input
                    multiple={true}
                    placeholder="Enter Product Name"
                    type="file"
                    disabled={isLoading}
                    {...field}
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
                      {categories.length > 0 ? (
                        categories?.map((category, i) => {
                          return (
                            <SelectItem value={category?.name} key={i}>
                              {category?.name}
                            </SelectItem>
                          );
                        })
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
          {/* {filesUrl.length > 0 && (
            <div className="pt-2">
              <FormLabel>Product Image{filesUrl.length > 1 && "s"}</FormLabel>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-10">
            {filesUrl.length > 0 &&
              filesUrl.map((file, i) => {
                return (
                  <div key={i}>
                    <Image
                      src={file as string}
                      alt="Product Image"
                      height={0}
                      width={0}
                      className="h-full w-full object-cover"
                    />
                  </div>
                );
              })}
          </div> */}
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

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
import { Button } from "../../../ui/button";
import FormStep from "@/components/cards/form-step";
// hooks
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
  CreateProductImage,
} from "@/app/libs/api";
// types
import {
  Category,
  Product,
  ProductAttribute,
  ProductSku,
} from "@prisma/client";
// functions
import { generateSHA256, generateSKUCode } from "@/app/libs/functions";
import CreateCategoryForm from "../category/create-category-form";
import CreateAttributeForm from "../attribute/create-attribute-form";
import ImageUpload from "@/components/image/image-upload";
import { getSignedS3Url } from "@/lib/s3";

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
  name: z
    .string()
    .min(8, { message: "Product name must be at least 8 characters" })
    .max(50, "Product name must be less than 50 characters"),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  categories: z.array(categorySchema),
  quantity: z.string().max(999999999, "Quantity must be less than 999999999"),
  price: z
    .string()
    .min(1, "Price must at least $1")
    .max(999999999, "Price must be less than $999999999"),
  attributes: z.array(productAttributeSchema),
  image: z.any(),
});

type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
  categories: Category[] | [];
  attributes: ProductAttribute[] | [];
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
      attributes: [{ productAttribute: "", productAttributeValue: "" }],
    },
  });

  const { control } = form;

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
    productAttributeValue: "",
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
    console.log(123);
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
        price: values.price,
        quantity: values.quantity,
      };

      const createdProductSku = await CreateProductSku(skuData);

      if (!createdProductSku) {
        toast.error("Error creating product SKU");
        throw new Error("Error creating product SKU");
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

  return (
    <section className="flex flex-col gap-4">
      {formStep !== PRODUCTFORMSTEP.CREATECATEGORY &&
        formStep !== PRODUCTFORMSTEP.CREATEATTRIBUTE && (
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {formStep === PRODUCTFORMSTEP.PRODUCT && (
                  <>
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
                        onClick={() =>
                          setFormStep(PRODUCTFORMSTEP.CREATECATEGORY)
                        }
                      >
                        <FaPlus />
                        Create category
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {categoryFields.map((field, index) => {
                        return (
                          <div key={field.id} className="flex items-end gap-4">
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
                                          <SelectItem
                                            value={category?.name}
                                            key={i}
                                          >
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
                              <Button
                                type="button"
                                onClick={() => categoryRemove(index)}
                                className="bg-red-500 hover:bg-red-600 transition-300"
                              >
                                Remove Category
                              </Button>
                            )}
                          </div>
                        );
                      })}
                      <Button
                        type="button"
                        onClick={() => categoryAppend(defaultCategory)}
                      >
                        Add Category
                      </Button>
                    </div>
                  </>
                )}
                {formStep === PRODUCTFORMSTEP.SKU && (
                  <>
                    <h2 className="text-2xl font-bold">Unit Details</h2>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Price</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
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
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Product Attributes</h2>
                      <Button
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-300"
                        onClick={() =>
                          setFormStep(PRODUCTFORMSTEP.CREATEATTRIBUTE)
                        }
                      >
                        <FaPlus />
                        Create attribute
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {attributeFields.map((field, index) => {
                        return (
                          <div key={field.id} className="flex items-end gap-4">
                            <FormField
                              control={form.control}
                              name={`attributes.${index}.productAttribute`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Attribute</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Attribute" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {attributes &&
                                      Array.isArray(attributes) &&
                                      attributes.length > 0 ? (
                                        attributes.map((attribute, i) => (
                                          <SelectItem
                                            value={attribute?.name}
                                            key={i}
                                          >
                                            {attribute?.name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem
                                          value="noattribute"
                                          disabled
                                        >
                                          No attributes
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {index > 0 && (
                              <Button
                                type="button"
                                onClick={() => attributeRemove(index)}
                                className="bg-red-500 hover:bg-red-600 transition-300"
                              >
                                Remove Attribute
                              </Button>
                            )}
                          </div>
                        );
                      })}

                      <Button
                        type="button"
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
      {formStep === PRODUCTFORMSTEP.CREATEATTRIBUTE && (
        <>
          <CreateAttributeForm
            formStep={PRODUCTFORMSTEP.SKU}
            setFormStep={setFormStep}
            attributes={[]}
            attributeValues={[]}
          />
        </>
      )}
    </section>
  );
};

export default CreateProductForm;

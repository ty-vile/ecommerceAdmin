"use client";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { Product, ProductSku } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import ImageUpload from "@/components/image/image-upload";
import { CreateProductImage } from "@/app/libs/api";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormStep from "@/components/cards/form-step";
import { SiGoogleforms } from "react-icons/si";
import { FaBoxesPacking } from "react-icons/fa6";
import { FaImages } from "react-icons/fa";

type Props = {
  product: Product;
  sku: ProductSku;
};

const productAttributeSchema = z.object({
  productAttribute: z.string(),
  productAttributeValue: z.string(),
});

const formSchema = z.object({
  sku: z
    .string()
    .min(8, { message: "Product sku must be at least 8 characters" })
    .max(50, "Product sku must be less than 50 characters"),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  image: z.any(),
  attributes: z.array(productAttributeSchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const enum SKUFORMSTEP {
  OVERVIEW = 0,
  ATTRIBUTES = 1,
  IMAGES = 2,
}

const ProductSkuForm = ({ product, sku }: Props) => {
  // form state
  const [formStep, setFormStep] = useState(SKUFORMSTEP.OVERVIEW);
  const [isLoading, setIsLoading] = useState(false);
  // file state
  const [files, setFiles] = useState<any[]>([]);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: sku?.sku,
      description: product?.description,
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

  const onSubmit = async () => {
    try {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const checkSum = await generateSHA256(files[i]);
          const { signedS3Url, productImageData } = await getSignedS3Url(
            sku?.sku!,
            files[i].type,
            files[i].size,
            checkSum,
            sku?.id!
          );

          if (!signedS3Url) {
            throw new Error("Error creating S3 URL");
          }
          const url = signedS3Url;
          const response = await fetch(url, {
            method: "PUT",
            body: files[i],
            headers: {
              "Content-Type": files[i].type,
            },
          });
          await CreateProductImage(productImageData);
        }
        toast.success("Images succesfully uploaded");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-8">
        <FormStep
          formStep={formStep}
          skuFormStep={SKUFORMSTEP.OVERVIEW}
          stepNumber={1}
          setFormStep={setFormStep}
          content="Product Overview"
        >
          <SiGoogleforms className="text-3xl" />
        </FormStep>
        <FormStep
          formStep={formStep}
          skuFormStep={SKUFORMSTEP.ATTRIBUTES}
          stepNumber={2}
          setFormStep={setFormStep}
          content="Product Attributes"
        >
          <FaBoxesPacking className="text-3xl" />
        </FormStep>
        <FormStep
          formStep={formStep}
          skuFormStep={SKUFORMSTEP.IMAGES}
          stepNumber={3}
          setFormStep={setFormStep}
          content="Product Images"
        >
          <FaImages className="text-3xl" />
        </FormStep>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Sku</FormLabel>
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
          {fields.map((field, index) => {
            return (
              <div key={index}>
                <FormField
                  key={field.id}
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
                  <Button type="button" onClick={() => remove(index)}>
                    Remove Attribute
                  </Button>
                )}
              </div>
            );
          })}
          <Button type="button" onClick={() => append(defaultAttribute)}>
            Add Attribute
          </Button>

          <ImageUpload
            files={files}
            filesUrl={filesUrl}
            isLoading={isLoading}
            form={form}
            setFiles={setFiles}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default ProductSkuForm;

// http://localhost:3000/dashboard/products/clq7iidds0001ln8dfsj4egq0/clq7iie640004ln8d6lva29q7

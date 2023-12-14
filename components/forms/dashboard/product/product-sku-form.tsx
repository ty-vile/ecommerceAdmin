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
import { useForm } from "react-hook-form";
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

type Props = {
  product: Product;
  sku: ProductSku;
};

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
});

const ProductSkuForm = ({ product, sku }: Props) => {
  // form state
  const [isLoading, setIsLoading] = useState(false);
  // file state
  const [files, setFiles] = useState<any[]>([]);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: sku?.sku,
      description: product?.description,
    },
  });

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
          }).then(async () => {
            await CreateProductImage(productImageData);
          });
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
          <ImageUpload
            files={files}
            filesUrl={filesUrl}
            isLoading={isLoading}
            form={form}
            setFiles={setFiles}
          />
          <Button>Submit</Button>
          <Button
            onClick={() =>
              CreateProductImage({
                url: "123",
                productSkuId: "123",
              })
            }
          >
            TEST
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default ProductSkuForm;

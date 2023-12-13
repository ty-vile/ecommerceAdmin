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

type Props = {
  product: Product | null;
  sku: ProductSku | null;
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const checkSum = await generateSHA256(files[i]);
          const signedS3Url = await getSignedS3Url(
            sku?.sku!,
            files[i].type,
            files[i].size,
            checkSum
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
        }
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
          {/* NOTES -- OLD IMAGE COMPONENT */}
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <Label
                  htmlFor="product-file-images"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Upload Images
                  <FormControl>
                    <Input
                      multiple={true}
                      type="file"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => handleImageAdd(e)}
                      accept=".jpg, .jpeg, .png"
                      id="product-file-images"
                      className="hidden"
                    />
                  </FormControl>
                </Label>
                {files.length > 0 && (
                  <Label className="pl-4">{files.length} Images Selected</Label>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {filesUrl.length > 0 && (
            <div className="pt-2">
              <FormLabel>Product Image{filesUrl.length > 1 && "s"}</FormLabel>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-10">
            {filesUrl.length > 0 &&
              filesUrl.map((file, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-4 group relative transition-300"
                  >
                    
                    <div className="flex items-center justify-center absolute top-0 left-0 h-full w-full bg-black/50 invisible lg:group-hover:visible">
                      <Button
                        className="p-2 bg-red-500 hover:bg-red-600 z-20 text-white rounded-full"
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                      >
                        <IoMdClose className="text-2xl" />
                      </Button>
                    </div>
                    <Image
                      src={file as string}
                      alt="Product Image"
                      height={0}
                      width={0}
                      className="h-full w-full object-cover"
                    />
                    
                    <Button
                      className="flex items-center gap-4 bg-red-500 hover:bg-red-600 transition-300 w-full  visible lg:hidden"
                      type="button"
                    >
                      Remove <FaTrash />
                    </Button>
                  </div>
                );
              })}
          </div> */}
          <Button>Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default ProductSkuForm;

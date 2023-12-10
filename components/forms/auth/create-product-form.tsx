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
// nextjs
import Image from "next/image";
// aws
import { getSignedS3Url } from "@/lib/s3";

const formSchema = z.object({
  name: z
    .string()
    .min(8, { message: "Product name must be at least 8 characters" })
    .max(50, "Product name must be less than 50 characters"),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(200, "Product description must be less than 200 characters"),
  image: z.any(),
});

const CreateProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // ADD PRODUCT - SKU - ATTRIBUTE - ATTRIBUTE VALUE TO DB

    try {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const signedS3Url = await getSignedS3Url(`test-file-${i}`);

          if (!signedS3Url) {
            throw new Error("Error creating S3 URL");
          }

          const url = signedS3Url;
          await fetch(url, {
            method: "PUT",
            body: files[i],
            headers: {
              "Content-Type": files[i].type,
            },
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
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
          <FormField
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
          />
          {filesUrl.length > 0 && (
            <div className="pt-2">
              <FormLabel>Product Image{filesUrl.length > 1 && "s"}</FormLabel>
            </div>
          )}
          <div className="flex items-center gap-4 overflow-x-scroll">
            {filesUrl.length > 0 &&
              filesUrl.map((file, i) => {
                return (
                  <div key={i}>
                    <Image
                      src={file as string}
                      alt="Product Image"
                      height={0}
                      width={0}
                      className="h-auto w-auto max-h-64"
                    />
                  </div>
                );
              })}
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

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
import { CreateProduct } from "@/app/libs/api";
import ProgressBar from "@/components/progress/progress-bar";

enum FORM_STEPS {
  PRODUCT = 0,
  SKU = 1,
}

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
  // form state
  const [formStep, setFormStep] = useState<FORM_STEPS>(FORM_STEPS.PRODUCT);
  const [isLoading, setIsLoading] = useState(false);
  // file state
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [filesUrl, setFileUrls] = useState<String[] | []>([]);
  // progress-bar state
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const router = useRouter();

  // https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
  // modified first line to take file as buffer not text
  const generateSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
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

    const createProduct = await CreateProduct(values);

    if (!createProduct) {
      throw new Error("Error creating product");
    }

    // CREATE SKU

    try {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const checkSum = await generateSHA256(files[i]);

          const signedS3Url = await getSignedS3Url(
            // replace test file with product-name/sku
            `test-file-${i}`,
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

          if (response.ok) {
            // upload image to db
          }
        }
      }

      toast.success("Product sucessfully created");
      setFormStep(FORM_STEPS.SKU);
      setProgressPercentage(100);
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

  let formContent: React.ReactNode;

  if (formStep === FORM_STEPS.PRODUCT) {
    formContent = (
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
  }

  return (
    <div className="h-[90vh]">
      <div className="pb-4">
        <ProgressBar percentage={progressPercentage} />
      </div>
      {formContent}
    </div>
  );
};

export default CreateProductForm;

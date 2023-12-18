"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
// components
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// next
import Image from "next/image";
// icons
import { FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

type Props = {
  isLoading: boolean;
  files: any[];
  filesUrl: String[] | [];
  form: any;
  setFiles: (files: any[]) => void;
};

const ImageUpload = ({ isLoading, files, filesUrl, form, setFiles }: Props) => {
  // handle file change - input
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventFiles = e.target.files;

    if (eventFiles) {
      const newFiles = Array.from(eventFiles);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold pb-4">Product Images</h2>
      <FormField
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
                {/* overlay to remove image - desktop only */}
                <div className="flex items-center justify-center absolute top-0 left-0 h-full w-full bg-black/50 invisible lg:group-hover:visible">
                  <Button
                    className="p-2 bg-red-600 bg-red-700 z-20 text-white rounded-full"
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
                {/* button to remove image - mobile only */}
                <Button
                  className="flex items-center gap-4 bg-red-600 bg-red-700 transition-300 w-full  visible lg:hidden"
                  type="button"
                >
                  Remove <FaTrash />
                </Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ImageUpload;

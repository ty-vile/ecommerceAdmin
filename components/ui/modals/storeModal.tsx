"use client";

// components
import { Modal } from "@/components/ui/modal";
// hooks
import { useStoreModal } from "@/hooks/useStoreModal";
import { useRouter } from "next/navigation";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// hooks
import { useForm } from "react-hook-form";
import { useState } from "react";
// shadcn
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// toast
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters" })
    .max(39, { message: "Store name must be less then 40 characters" }),
});

export const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the appropriate content-type for your data
        },
        body: JSON.stringify(values), // Convert data object to JSON string
      });

      if (response.ok) {
        const data = await response.json();

        router.refresh();
        router.push(`/${data.id}`);

        setTimeout(() => {
          storeModal.onClose();
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error creating store`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Create a new store to manage products"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Store Name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end pt-6 space-x-6">
              <Button
                variant="outline"
                onClick={storeModal.onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button>Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

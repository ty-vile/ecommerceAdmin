"use client";

// react-hook-form
import { useFieldArray } from "react-hook-form";
// shadcn
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/buttons/forms/delete-button";

type Props = {
  nestIndex: number;
  control: any;
  isLoading: boolean;
};

const NestedAttribute = ({ nestIndex, control, isLoading }: Props) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `attributes.${nestIndex}.productAttributeValues`,
  });

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div className="flex items-end gap-4" key={field.id}>
            <FormField
              control={control}
              name={`attributes.${nestIndex}.productAttributeValues.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute Value {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Attribute Value"
                      type="text"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {index > 0 && (
              <DeleteButton
                content="Remove Attribute"
                deleteFunc={remove}
                index={index}
              />
            )}
          </div>
        );
      })}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          className="w-fit"
          onClick={() =>
            append({
              name: "",
            })
          }
        >
          Add Value
        </Button>
      </div>
    </>
  );
};

export default NestedAttribute;

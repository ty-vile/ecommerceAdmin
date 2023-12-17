import React from "react";
import { useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        return (
          <div className="flex items-end gap-4">
            <FormField
              key={field.id}
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
              <Button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 hover:bg-red-600 transition-300"
              >
                Remove Value
              </Button>
            )}
          </div>
        );
      })}
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
  );
};

export default NestedAttribute;

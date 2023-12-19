"use client";

// react-hook-forms
import { useFieldArray } from "react-hook-form";
// react
import { useEffect, useState } from "react";
// shadcn
import {
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
import DeleteButton from "@/components/buttons/forms/delete-button";

type Props = {
  nestIndex: number;
  control: any;
  isLoading: boolean;
  productAttributeId: string;
  attributes: {
    id: string;
    name: string;
    productAttributeValues: {
      id: string;
      name: string;
      hexCode: string | null;
      productAttributeId: string;
    }[];
  }[];
};

const NestedProductAttribute = ({
  nestIndex,
  control,
  isLoading,
  productAttributeId,
  attributes,
}: Props) => {
  const [attributeValues, setAttributeValues] = useState<any>([]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: `attributes.${nestIndex}.productAttributeValues`,
  });

  useEffect(() => {
    if (!productAttributeId) {
      return;
    }

    const filteredAttributes = attributes.filter(
      (attribute: any) => attribute.id === productAttributeId
    );

    const filteredAttributeValues =
      filteredAttributes[0].productAttributeValues;

    setAttributeValues(filteredAttributeValues);
  }, [productAttributeId]);

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attributeValues &&
                      Array.isArray(attributeValues) &&
                      attributeValues.length > 0 ? (
                        attributeValues.map((attribute, i) => (
                          <SelectItem value={attribute.name} key={i}>
                            {attribute?.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="noattributevalues" disabled>
                          No values
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
    </>
  );
};

export default NestedProductAttribute;

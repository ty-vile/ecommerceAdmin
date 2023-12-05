"use client";

// shadcn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
// hooks
import { useStoreModal } from "@/hooks/useStoreModal";
// prisma
import { Store } from "@prisma/client";
// react
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
// components
import { Button } from "@/components/ui/button";

// icons
import { FaStoreAlt, FaCheck, FaPlusCircle } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
// utils
import { cn } from "@/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface Props extends PopoverTriggerProps {
  stores: Store[];
}

const StoreSwitcher: React.FC<Props> = ({ className, stores = [] }) => {
  const [open, setOpen] = useState(false);

  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const storeValues = stores.map((store) => ({
    label: store.name,
    id: store.id,
  }));

  const currentStore = storeValues.find((store) => store.id === params.storeId);

  const onStoreChange = (store: { id: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <FaStoreAlt className="mr-2 h-4 w-4" />
          Store
          <LuChevronsUpDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Select store..." />
            <CommandEmpty>No store found...</CommandEmpty>
            <CommandGroup heading="Stores">
              {storeValues.map((store) => {
                return (
                  <CommandItem
                    key={store.id}
                    onSelect={() => onStoreChange(store)}
                    className="text-sm"
                  >
                    <FaStoreAlt className="mr-2 h-4 w-4" />
                    {store.label}
                    <FaCheck
                      className={cn(
                        "ml-auto w-4 h-4",
                        currentStore?.id === store.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <FaPlusCircle className="mr-4 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;

"use client";

import { useState } from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandInput,
} from "@/components/ui/command";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface MultiSelectProps {
  collections: CollectionTypes[];
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  collections = [],
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Filter selected collections
  const selected: CollectionTypes[] = value
    .map((id) => collections.find((collection) => collection._id === id))
    .filter((item): item is CollectionTypes => item !== undefined); // Filters undefined results

  const selectable = collections.filter(collection => !selected.includes(collection))

  // Function to handle selection
  const handleSelect = (id: string) => {
    if (!value.includes(id)) {
      onChange(id); // Add only if it's not already in the selected list
    } else {
      toast.error("This collection is already selected.");
    }
    setInputValue("")
  };

  return (
    <>
      <Command className="overflow-visible bg-white">
        <div className="flex gap-1 flex-wrap border rounded-md">
          {selected.map((collection) => (
            <Badge key={collection._id}>
              {collection.title}
              <button
                aria-label="Remove collection"
                className="ml-1 hover:bg-red-100"
                onClick={() => onRemove(collection._id)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
        <div className="relative mt-2">
          {open && (
            <CommandList className="absolute w-full z-10 top-0 overflow-auto border rounded-md shadow-md">
              {selectable.length > 0 ? (
                selectable.map((collection) => (
                  <CommandItem className="hover:bg-grey-2 cursor-pointer"
                    key={collection._id}
                    onSelect={() => handleSelect(collection._id)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {collection.title}
                  </CommandItem>
                ))
              ) : (
                <div className="p-2">No collections found</div>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    </>
  );
};

export default MultiSelect;

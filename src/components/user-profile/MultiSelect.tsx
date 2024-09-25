import React from "react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: { value: string; label: string }[];
  onChange: (selected: { value: string; label: string }[]) => void;
}

export default function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option: { value: string; label: string }) => {
    if (value.some(selected => selected.value === option.value)) {
      onChange(value.filter(selected => selected.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value.length > 0
            ? value.map(selected => selected.label).join(", ")
            : "Select..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <CommandInput placeholder="Search..." />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map(option => (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option)}
              className={value.some(selected => selected.value === option.value) ? "bg-gray-200" : ""}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </PopoverContent>
    </Popover>
  );
}
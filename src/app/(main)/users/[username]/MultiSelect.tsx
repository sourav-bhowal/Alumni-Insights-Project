import React from "react";
import Select from "react-select";
import { components } from "react-select";
import { ChevronDown } from "lucide-react";

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: { value: string; label: string }[];
  onChange: (value: { value: string; label: string }[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      options={options}
      value={value}
      // @ts-ignore
      onChange={onChange}
      isMulti
      components={{ DropdownIndicator }}
      classNamePrefix="react-select"
      menuPlacement="top"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: "grey",
          backgroundColor: "gray",
          "&:hover": { borderColor: "black" },
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "#e5e7eb",
          borderRadius: "0.25rem",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#000000", // Set text color to black
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#6b7280",
          "&:hover": {
            backgroundColor: "#f3f4f6",
            color: "#374151",
          },
        }),
        input: (base) => ({
          ...base,
          color: "#000000", // Set input text color to black
        }),
        placeholder: (base) => ({
          ...base,
          color: "#000000", // Set placeholder text color to black
        }),
        singleValue: (base) => ({
          ...base,
          color: "#000000", // Set single value text color to black
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "black",
        }),
      }}
    />
  );
};

export default MultiSelect;

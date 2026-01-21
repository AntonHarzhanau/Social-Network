import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface SearchInputProps {
  searchId: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput = ({
  searchId,
  placeholder,
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <InputGroup>
      <InputGroupInput
        id={searchId}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;

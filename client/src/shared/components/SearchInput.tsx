import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const SearchInput = () => {
  return (
    <InputGroup>
      <InputGroupInput id="search-all" type="search" placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;

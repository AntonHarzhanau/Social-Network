import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchInput = () => {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-muted-foreground" />
      </span>
      <Input className="w-60 h-8 pl-10" placeholder="Search..." />
    </div>
  );
};

export default SearchInput;

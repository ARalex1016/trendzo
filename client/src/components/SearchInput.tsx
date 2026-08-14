import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SearchInput({
  value,
  onChange,
  placeholder,
}: React.ComponentProps<"input">) {
  return (
    <InputGroup className="bg-background! rounded-lg">
      <InputGroupAddon>
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>

      <InputGroupInput
        type="text"
        value={value}
        placeholder={placeholder ?? "Search..."}
        onChange={onChange}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </InputGroup>
  );
}

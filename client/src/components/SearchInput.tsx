import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SearchInput() {
  return (
    <InputGroup className="bg-background! rounded-lg">
      <InputGroupAddon>
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>

      <InputGroupInput
        type="text"
        placeholder="Search..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </InputGroup>
  );
}

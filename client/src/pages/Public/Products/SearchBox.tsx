import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Components
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

// Store
import useProductStore from "@/store/useProductStore";

// Types
import type { ISuggestion } from "@/types/product/index.type";

const SearchBox = ({ className }: { className?: string }) => {
  const { getAutoSuggestions } = useProductStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [skipFetch, setSkipFetch] = useState(false); // <-- new flag

  const fetchAutoSuggestion = async (query: string) => {
    try {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      let res = await getAutoSuggestions(query);

      setSuggestions(res ?? []);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleSearch = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("slug", slug);
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
  };

  const handleSuggestionSelect = (suggestion: ISuggestion) => {
    setQuery(suggestion.name);
    handleSearch(suggestion.slug);

    setSuggestions([]);
    setSkipFetch(true); // <-- skip next fetch
  };

  useEffect(() => {
    if (skipFetch) {
      setSkipFetch(false); // reset flag
      return; // skip fetching
    }

    if (!query.trim()) {
      const params = new URLSearchParams(searchParams);
      params.delete("slug");
      setSearchParams(params);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchAutoSuggestion(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className={`max-w-xl lg:min-w-64 xl:min-w-96 ${className}`}>
      <Combobox items={suggestions}>
        <ComboboxInput
          value={query}
          placeholder="Search Product"
          onChange={handleSearchChange}
          className="w-full"
        />
        {suggestions.length > 0 && (
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>

            <ComboboxList>
              {(suggestion) => (
                <ComboboxItem
                  key={suggestion.slug}
                  value={suggestion.name}
                  // onSelect={() => handleSuggestionSelect(suggestion)}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        )}
      </Combobox>
    </div>
  );
};

export default SearchBox;

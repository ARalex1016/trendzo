import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/Badges/StatusBadge";

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

interface FilterSearch {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

interface FilterSort<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
}

interface FilterTabs<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
}

interface FilterProps<
  TSort extends string = string,
  TTab extends string = string,
> {
  search?: FilterSearch;

  sort?: FilterSort<TSort>;

  tabs?: FilterTabs<TTab>;

  className?: string;
}

const Filter = <TSort extends string = string, TTab extends string = string>({
  search,
  sort,
  tabs,
  className = "",
}: FilterProps<TSort, TTab>) => {
  return (
    <div
      className={`bg-background1 flex flex-col gap-y-3 rounded-2xl border border-border p-5 ${className}`}
    >
      {/* Search + Sort */}
      {(search || sort) && (
        <div className="flex w-full flex-col items-center gap-3 lg:flex-row">
          {search && (
            <SearchInput
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? "Search..."}
            />
          )}

          {sort && (
            <select
              value={sort.value}
              onChange={(e) => sort.onChange(e.target.value as TSort)}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/20 dark:bg-[#161618] dark:text-foreground"
            >
              {sort.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-background text-foreground"
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Tabs */}
      {tabs && (
        <div className="flex flex-row gap-x-3 overflow-auto no-scrollbar">
          {tabs.options.map((option) => {
            const isActive = tabs.value === option.value;

            return (
              <StatusBadge
                key={option.value}
                variant={isActive ? "purple" : "gray"}
                className="cursor-pointer whitespace-nowrap text-sm md:text-base"
                onClick={() => tabs.onChange(option.value)}
              >
                {option.label}
              </StatusBadge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Filter;

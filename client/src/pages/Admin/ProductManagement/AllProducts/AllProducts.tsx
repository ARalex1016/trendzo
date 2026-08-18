// Components
import { PageShell, TitleTextContainer } from "@/components/Container";
import Stats from "./Stats";
import { SearchInput } from "@/components/SearchInput";
import ProductTable from "./ProductTable";

const AllProducts = () => {
  return (
    <PageShell>
      <TitleTextContainer title="Product Catalog">
        Manage your luxury fashion inventory
      </TitleTextContainer>

      <Stats />

      {/* Filter */}
      <div className="bg-accent/30 flex flex-col gap-y-3 rounded-2xl border border-border p-5">
        <div className="w-full flex flex-col lg:flex-row items-center gap-3">
          <SearchInput />

          <div className="w-full lg:w-fit flex flex-row gap-x-3">
            <select
              name=""
              id=""
              className="flex-1 rounded-xl border border-border px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              name=""
              id=""
              className="flex-1 rounded-xl border border-border px-3 py-2"
            >
              <option value="all">All Products</option>
              <option value="active">Featured Only</option>
              <option value="inactive">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      <ProductTable />
    </PageShell>
  );
};

export default AllProducts;

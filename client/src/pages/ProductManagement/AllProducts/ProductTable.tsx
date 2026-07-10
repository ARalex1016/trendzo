import { useEffect } from "react";
import type { TdHTMLAttributes, ThHTMLAttributes } from "react";

// Components
import AllProductPagination from "./AllProductPagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyButton } from "@/components/CopyButton";

// Config
import { BRAND } from "@/config/brand";

// Lib
import { cn } from "@/lib/utils";

// Store
import useProductStore from "@/store/useProductStore";
import useCategoryStore from "@/store/useCategoryStore";

// Utils
import { capitalize } from "@/utils/StringManager";
import { getTimeAgo } from "@/utils/DateManager";

// Icons
import { Ellipsis } from "lucide-react";

// Types
import type { IImage } from "@/types/product/index.type";

interface ProductNameProps {
  name: string;
  image: IImage;
  slug: string;
}

const Head = ({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(
        "capitalize text-foreground/70 text-center text-sm font-medium px-2 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const Data = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={cn("text-center px-2 py-3", className)} {...props}>
      {children}
    </td>
  );
};

const ProductName = ({ name, image, slug }: ProductNameProps) => {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <img
        src={image.url}
        alt={name}
        className="size-10 rounded-full shadow shadow-foreground/40 group-hover:scale-110 transition-all duration-300"
      />

      <div className="w-full flex flex-col items-start">
        <span className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-all duration-300">
          {capitalize(name)}
        </span>

        <div className="w-full flex flex-row gap-x-1">
          <p className="w-2/3 text-xs text-left text-foreground/60 truncate">
            {slug}
          </p>

          <CopyButton value={slug} size={"sm"} />
        </div>

        {/* <span className="text-xs text-foreground/60 line-clamp-1">{slug}</span> */}
      </div>
    </div>
  );
};

const Category = ({ id }: { id: string }) => {
  const { categoryMap } = useCategoryStore();

  return (
    <div className="max-w-16 inline-block line-clamp-1 text-[8px] text-foreground/60 font-medium bg-accent/50 border border-border rounded-xl overflow-hidden px-2 py-0.5">
      {categoryMap[id]?.name || id}
    </div>
  );
};

const Price = ({
  sellingPrice,
  discount,
}: {
  sellingPrice: number;
  discount?: number;
}) => {
  const finalSellingPrice = discount
    ? sellingPrice - (sellingPrice * discount) / 100
    : sellingPrice;

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-primary">
        {BRAND.currency.symbol}
        {finalSellingPrice}
      </span>

      {discount && (
        <span className="text-xs text-foreground/60 line-through">
          {BRAND.currency.symbol}
          {sellingPrice}
        </span>
      )}
    </div>
  );
};

const Discount = ({ discount }: { discount?: number }) => {
  if (discount) {
    return (
      <p className="inline-block text-sm font-medium text-success bg-success/20 rounded-xl px-2 py-1">
        {discount}%
      </p>
    );
  }
};

const Switch = ({
  state,
  onToggle,
}: {
  state: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "w-10 h-full flex flex-row items-center rounded-xl overflow-hidden transition-all duration-500 p-0.5",
        state ? "bg-success" : "bg-accent",
      )}
    >
      <div
        className={cn(
          "size-4.5 aspect-square rounded-full transition-all duration-500",
          state
            ? "bg-foreground translate-x-full"
            : "bg-background translate-x-0",
        )}
      />
    </div>
  );
};

const DropDownMenuAction = ({ slug }: { slug: string }) => {
  const { deleteBySlug } = useProductStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="size-7 flex flex-row justify-center items-center rounded-full p-1.5 hover:bg-accent transition-all duration-300">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-accent/5 backdrop-blur-lg p-3 mr-side-spacing">
        <DropdownMenuGroup>
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteBySlug(slug)}
            className="py-1!"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TableHead = () => {
  return (
    <tr>
      <Head className="min-w-14"></Head>
      <Head className="min-w-64 text-left!">Product</Head>
      <Head className="min-w-40 text-left!">Categories</Head>
      <Head className="min-w-24">Base Price</Head>
      <Head className="min-w-24">Price</Head>
      <Head className="min-w-24">Discount</Head>
      <Head className="min-w-24">Inventory</Head>
      <Head className="min-w-24">Variants</Head>
      <Head className="min-w-32">Featured</Head>
      <Head className="min-w-32">Active</Head>
      <Head className="min-w-32">Last Updated</Head>
      <Head className="min-w-20">Actions</Head>
    </tr>
  );
};

const TableBody = () => {
  const {
    adminProducts,
    getAllAdminProducts,
    toggleFeaturedBySlug,
    toggleActiveBySlug,
  } = useProductStore();

  const fetchAllProducts = async () => {
    try {
      await getAllAdminProducts();
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (!adminProducts) {
    return;
  }
  return (
    <>
      {adminProducts &&
        adminProducts.data.length >= 1 &&
        adminProducts.data.map((product) => (
          <tr
            key={product._id}
            className="border-b border-b-border hover:bg-accent/40 group"
          >
            <Data></Data>

            <Data>
              <ProductName
                name={product.name}
                image={product.thumbnail}
                slug={product.slug}
              />
            </Data>

            <Data className="flex flex-row flex-wrap gap-0.5">
              {product.categories.map((categoryId) => {
                return <Category key={categoryId} id={categoryId} />;
              })}
            </Data>

            <Data>
              <span className="text-sm font-medium text-foreground/80">
                {BRAND.currency.symbol}
                {product.baseCostPrice}
              </span>
            </Data>

            <Data>
              <Price
                sellingPrice={product.baseSellingPrice}
                discount={product.discount}
              />
            </Data>

            <Data>
              <Discount discount={product.discount} />
            </Data>

            {/* Inventory */}
            <Data>{product.stock}</Data>

            {/* Variants  */}
            <Data>{product.variants}</Data>

            {/* Featured */}
            <Data>
              <div className="flex flex-row justify-center items-center">
                <Switch
                  state={product.featured}
                  onToggle={() => toggleFeaturedBySlug(product.slug)}
                />
              </div>
            </Data>

            <Data>
              <div className="flex flex-row justify-center items-center">
                <Switch
                  state={product.isActive}
                  onToggle={() => toggleActiveBySlug(product.slug)}
                />
              </div>
            </Data>

            <Data>
              <span className="text-xs font-medium text-foreground/80">
                {getTimeAgo(product.updatedAt)}
              </span>
            </Data>

            <Data>
              <div className="flex flex-row justify-center items-center">
                <DropDownMenuAction slug={product.slug} />
              </div>
            </Data>
          </tr>
        ))}
    </>
  );
};

const ProductTable = () => {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-max w-full">
          <thead className="bg-accent/50 border-b border-b-border">
            <TableHead />
          </thead>

          <tbody>
            <TableBody />
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <AllProductPagination />
    </div>
  );
};

export default ProductTable;

import { useState, useEffect } from "react";
import type { TdHTMLAttributes, ThHTMLAttributes } from "react";

// Config
import { BRAND } from "@/config/brand";

// Lib
import { cn } from "@/lib/utils";

// Store
import useProductStore from "@/store/useProductStore";
import useCategoryStore from "@/store/useCategoryStore";

// Utils
import { capitalize } from "@/utils/StringManager";

// Types
import type { IProduct, IImage } from "@/types/product.type";

interface TableDataProps {
  product: IProduct;
}

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
        className="size-10 rounded-full shadow shadow-foreground/40"
      />

      <div className="flex flex-col items-start">
        <span className="text-sm font-medium line-clamp-1">
          {capitalize(name)}
        </span>

        <span className="text-xs text-foreground/60 line-clamp-1">{slug}</span>
      </div>
    </div>
  );
};

const Category = ({ id }: { id: string }) => {
  const { categoryMap } = useCategoryStore();

  return (
    <div className="inline-block text-[10px] text-foreground/60 font-medium bg-accent/50 border border-border rounded-xl px-2 py-0.5">
      {categoryMap[id]?.name}
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
      <span className="text-sm font-medium">
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

const Switch = () => {
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <div
      onClick={() => setIsOn((pre) => !pre)}
      className={cn(
        "w-10 h-full flex flex-row items-center rounded-xl overflow-hidden transition-all duration-500 p-1",
        isOn ? "bg-success" : "bg-accent",
      )}
    >
      <div
        className={cn(
          "w-4 aspect-square rounded-full transition-all duration-500",
          isOn
            ? "bg-foreground translate-x-0"
            : "bg-background translate-x-full",
        )}
      ></div>
    </div>
  );
};

const TableData = ({ product }: TableDataProps) => {
  const totalStocks = product.inventory?.reduce(
    (sum, item) => sum + item.stock,
    0,
  );

  const totalVariants = product.inventory?.length;

  return (
    <tr className="border-b border-b-border">
      <Data></Data>
      <Data>
        <ProductName
          name={product.name}
          image={product.thumbnail}
          slug={product.slug}
        />
      </Data>
      <Data className="flex flex-row flex-wrap gap-1">
        {product.categories.map((categoryId) => {
          return <Category key={categoryId} id={categoryId} />;
        })}
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
      <Data>{totalStocks}</Data> {/* Inventory */}
      <Data>{totalVariants}</Data> {/* Variants  */}
      <Data className="flex flex-row justify-center items-center ">
        <Switch />
      </Data>
      <Data>{product.updatedAt}/</Data>
    </tr>
  );
};

const ProductTable = () => {
  const { getAllProducts } = useProductStore();

  const [productLists, setProductLists] = useState<IProduct[] | null>(null);

  const fetchAllProducts = async () => {
    try {
      let res = await getAllProducts();

      if (res?.data) {
        setProductLists(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (!productLists) {
    return;
  }

  return (
    <div className="bg-accent/30 border border-border rounded-xl overflow-x-auto no-scrollbar">
      <table>
        <thead className="bg-accent/50 border-b border-b-border">
          <tr>
            <Head className="min-w-14"></Head>
            <Head className="min-w-64 text-left!">Product</Head>
            <Head className="min-w-40 text-left!">Categories</Head>
            <Head className="min-w-24">Price</Head>
            <Head className="min-w-24">Discount</Head>
            <Head className="min-w-24">Inventory</Head>
            <Head className="min-w-24">Variants</Head>
            <Head className="min-w-32">Featured</Head>
            <Head className="min-w-32">Active</Head>
            <Head className="min-w-32">Updated</Head>
            <Head className="min-w-24">Actions</Head>
          </tr>
        </thead>

        <tbody>
          {productLists &&
            productLists?.length >= 1 &&
            productLists?.map((product) => {
              return <TableData key={product._id} product={product} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

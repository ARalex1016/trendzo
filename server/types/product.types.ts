// types/product.input.ts (recommended)
export interface VariantInput {
  color: string;
  images: string[];
  sizes: {
    size: string;
    stock?: number;
    costPrice?: number;
    sellingPrice?: number;
  }[];
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;

  baseCostPrice: number;
  baseSellingPrice: number;

  discount?: number;

  specifications?: {
    weight?: number;
    material?: string;
    countryOfOrigin?: string;
    warranty?: string;
  };

  variants?: VariantInput[];

  categories: string[];
  tags?: string[];
  featured?: boolean;
}

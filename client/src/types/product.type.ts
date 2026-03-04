export interface IVariantSize {
  size: string; // e.g. "M", "L", "XL"
  stock: number;
  costPrice: number;
  sellingPrice: number;
}

export interface IVariant {
  color: string; // e.g. "Black", "Red"
  images: string[];
  sizes: IVariantSize[];
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  specifications: {
    weight?: number;
    material?: string;
    countryOfOrigin?: string;
    warranty?: string;
  };
  variants: IVariant[];
  baseCostPrice: number;
  baseSellingPrice: number;
  discount?: number;
  categories: string[];
  tags: string[];
  featured: boolean;
  isActive: boolean;
  createdBy: string; // admin or operator (ObjectId)
  createdAt: Date;
  updatedAt: Date;
}

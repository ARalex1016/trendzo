import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IVariantSize {
  size: string; // e.g. "M", "L", "XL"
  stock: number; // stock for this size
  // Prices
  costPrice: number; // ORIGINAL price (for profit calculation)
  sellingPrice: number; // What customer pays
}

export interface IVariant {
  color: string; // e.g. "Black", "Red"
  images: string[]; // images for this specific color
  sizes: IVariantSize[]; // size list for this color
}

export interface IProduct extends Document {
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
  baseCostPrice: number; // fallback price if no variant price
  baseSellingPrice: number; // fallback price if no variant price
  discount?: number;
  categories: Types.ObjectId[]; // ObjectId[]
  tags: string[];
  featured: boolean;
  isActive: boolean;
  createdBy: Types.ObjectId; // admin or operator (ObjectId)
  createdAt: Date;
  updatedAt: Date;
}

const variantSizeSchema = new Schema<IVariantSize>(
  {
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },

    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
  },
  { _id: false }
);

const variantSchema = new Schema<IVariant>(
  {
    color: { type: String, required: true },
    images: [{ type: String, required: true }],
    sizes: [variantSizeSchema],
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      weight: Number,
      material: String,
      countryOfOrigin: String,
      warranty: String,
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    baseCostPrice: {
      type: Number,
      required: true,
    },
    baseSellingPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;

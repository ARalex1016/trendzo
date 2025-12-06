import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IVariantSize {
  size: string; // e.g. "M", "L", "XL"
  stock: number; // stock for this size
  price?: number; // optional size-specific price
}

export interface IVariant {
  color: string; // e.g. "Black", "Red"
  images: string[]; // images for this specific color
  basePrice?: number; // optional price for entire color
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
  basePrice: number; // fallback price if no variant price
  discount?: number;
  categories: Types.ObjectId[]; // ObjectId[]
  tags: string[];
  featured: boolean;
  createdBy: Types.ObjectId; // admin or operator (ObjectId)
  createdAt: Date;
  updatedAt: Date;
}

const variantSizeSchema = new Schema<IVariantSize>(
  {
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number }, // optional, size-specific price
  },
  { _id: false }
);

const variantSchema = new Schema<IVariant>(
  {
    color: { type: String, required: true },
    images: [{ type: String, required: true }],
    basePrice: { type: Number }, // Optional color-level price
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
    basePrice: {
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

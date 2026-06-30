import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IInventory {
  color: Types.ObjectId;
  size: Types.ObjectId;
  stock: number;
}

export interface IImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;

  description: string;

  specifications: {
    weight?: string;
    material?: string;
    countryOfOrigin?: string;
    warranty?: string;
  };

  // Base images (same for all variants)
  images: IImage[];
  thumbnail: IImage;

  // Price only at base level
  baseCostPrice: number;
  baseSellingPrice: number;
  discount?: number;

  // Available options
  colors: Types.ObjectId[];
  sizes: Types.ObjectId[];

  // Inventory for each combination
  inventory: IInventory[];

  categories: Types.ObjectId[];
  tags: string[];

  featured: boolean;
  isActive: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

// Schema //
const inventorySchema = new Schema<IInventory>(
  {
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
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
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    specifications: {
      weight: String,
      material: String,
      countryOfOrigin: String,
      warranty: String,
    },

    images: {
      type: [imageSchema],
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message: "At least one image is required",
      },
    },

    thumbnail: {
      type: imageSchema,
      required: true,
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

    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Color",
        required: true,
      },
    ],

    sizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Size",
        required: true,
      },
    ],

    inventory: {
      type: [inventorySchema],
      default: [],
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    tags: [String],

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
  { timestamps: true },
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema,
);

export default Product;

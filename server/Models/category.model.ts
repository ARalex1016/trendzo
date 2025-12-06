import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  slug: string; // SEO-friendly URL
  metaTitle?: string; // SEO title
  metaDescription?: string; // SEO description
  isActive: boolean; // enable/disable category without deleting
  parentCategory?: Types.ObjectId | null; // for nested categories
  createdBy: Types.ObjectId; // Admin who created this category
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: String,
    image: String,
    slug: { type: String, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
);
export default Category;

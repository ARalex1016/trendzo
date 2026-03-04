import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ISize extends Document {
  name: string; // "M", "32", "40 EU"
  slug: string;
  type: "alpha" | "numeric" | "shoe" | "custom";
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    height?: number;
    width?: number;
    depth?: number;
  };
  unit?: "cm" | "inch";
  isActive: boolean;
}

const sizeSchema = new Schema<ISize>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Size: Model<ISize> = mongoose.model<ISize>("Size", sizeSchema);

export default Size;

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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["alpha", "numeric", "shoe", "custom"],
      required: true,
    },
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      length: { type: Number },
      height: { type: Number },
      width: { type: Number },
      depth: { type: Number },
    },
    unit: {
      type: String,
      enum: ["cm", "inch"],
      default: "cm",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

sizeSchema.index({ name: 1, type: 1 }, { unique: true });

const Size: Model<ISize> = mongoose.model<ISize>("Size", sizeSchema);

export default Size;

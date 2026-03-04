import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IColor extends Document {
  name: string; // Black
  slug: string; // black
  hexCode: string; // #000000
  rgb?: string; // optional
  isActive: boolean;
}

const colorSchema = new Schema<IColor>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    hexCode: { type: String, required: true },
    rgb: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Color: Model<IColor> = mongoose.model<IColor>("Color", colorSchema);

export default Color;

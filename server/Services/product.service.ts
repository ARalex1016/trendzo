// services/product.service.ts
import { Types } from "mongoose";

// Models
import Product from "./../Models/product.model.ts";

// Decrement stock
export const decrementProductStock = async (
  productId: Types.ObjectId,
  color: string,
  size: string,
  qty: number,
  session: any
): Promise<boolean> => {
  // arrayFilters: match the variant and the size
  const res = await Product.updateOne(
    { _id: productId },
    {
      $inc: {
        // -qty
        "variants.$[v].sizes.$[s].stock": -qty,
      },
    },
    {
      arrayFilters: [
        { "v.color": color },
        { "s.size": size, "s.stock": { $gte: qty } },
      ],
      session,
    }
  );

  // res.modifiedCount (mongoose 6+) or res.nModified (older)
  const modified = (res as any).modifiedCount ?? (res as any).nModified ?? 0;
  return modified > 0;
};

// Restore stock
export const restoreProductStock = async (
  productId: Types.ObjectId,
  color: string,
  size: string,
  qty: number,
  session: any
): Promise<void> => {
  await Product.updateOne(
    { _id: productId },
    {
      $inc: {
        "variants.$[v].sizes.$[s].stock": qty,
      },
    },
    {
      arrayFilters: [{ "v.color": color }, { "s.size": size }],
      session,
    }
  );
};

import { Types, type ClientSession } from "mongoose";

// Models
import Product, { type IProduct } from "../Models/product.model.ts";

const ProductRepository = {
  /* ------------------------------------------------ */
  /* READ */
  /* ------------------------------------------------ */
  findAll(query: any) {
    return Product.find(query);
  },

  findFeatured(query: any) {
    return Product.find({ featured: true, ...query });
  },

  findById(id: Types.ObjectId) {
    return Product.findById(id);
  },

  findBySlug(slug: string) {
    return Product.findOne({ slug });
  },

  findAutoSuggestions(searchQuery: any, limit = 10) {
    return Product.find(searchQuery, {
      name: 1,
      slug: 1,
      _id: 0,
    })
      .limit(limit)
      .lean();
  },

  /* ------------------------------------------------ */
  /* WRITE */
  /* ------------------------------------------------ */
  create(data: Partial<IProduct>) {
    return Product.create(data);
  },

  updateById(id: Types.ObjectId, updates: Partial<IProduct>) {
    return Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, context: "query" },
    );
  },

  deleteById(id: Types.ObjectId) {
    return Product.findByIdAndDelete(id);
  },

  /* ------------------------------------------------ */
  /* INVENTORY */
  /* ------------------------------------------------ */
  decrementStock(
    productId: Types.ObjectId,
    colorId: Types.ObjectId,
    sizeId: Types.ObjectId,
    qty: number,
    session?: ClientSession,
  ) {
    const options: any = {
      arrayFilters: [
        {
          "i.color": colorId,
          "i.size": sizeId,
          "i.stock": { $gte: qty }, // prevent negative stock
        },
      ],
    };

    if (session) options.session = session;

    return Product.updateOne(
      { _id: productId },
      {
        $inc: {
          "inventory.$[i].stock": -qty,
        },
      },
      options,
    );
  },

  restoreStock(
    productId: Types.ObjectId,
    colorId: Types.ObjectId,
    sizeId: Types.ObjectId,
    qty: number,
    session?: ClientSession,
  ) {
    const options: any = {
      arrayFilters: [
        {
          "i.color": colorId,
          "i.size": sizeId,
        },
      ],
    };

    if (session) options.session = session;

    return Product.updateOne(
      { _id: productId },
      {
        $inc: {
          "inventory.$[i].stock": qty,
        },
      },
      options,
    );
  },
};

export default ProductRepository;

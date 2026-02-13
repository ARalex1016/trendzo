import { Types, type ClientSession } from "mongoose";

// Models
import Product, { type IProduct } from "../Models/product.model.ts";

export const ProductRepository = {
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

  create(data: Partial<IProduct>) {
    return Product.create(data);
  },

  updateById(id: Types.ObjectId, updates: Partial<IProduct>) {
    return Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    );
  },

  deleteById(id: Types.ObjectId) {
    return Product.findByIdAndDelete(id);
  },

  decrementStock(
    productId: Types.ObjectId,
    color: string,
    size: string,
    qty: number,
    session?: ClientSession
  ) {
    const query = {
      _id: productId,
      "variants.color": color,
      "variants.sizes": {
        $elemMatch: {
          size,
          stock: { $gte: qty },
        },
      },
    };

    const update = {
      $inc: {
        "variants.$[v].sizes.$[s].stock": -qty,
      },
    };

    const options: any = {
      arrayFilters: [{ "v.color": color }, { "s.size": size }],
    };

    if (session) {
      options.session = session;
    }

    return Product.updateOne(query, update, options);
  },

  restoreStock(
    productId: Types.ObjectId,
    color: string,
    size: string,
    qty: number,
    session?: ClientSession
  ) {
    const options: any = {
      arrayFilters: [{ "v.color": color }, { "s.size": size }],
    };

    if (session) {
      options.session = session;
    }

    return Product.updateOne(
      { _id: productId },
      {
        $inc: {
          "variants.$[v].sizes.$[s].stock": qty,
        },
      },
      options
    );
  },
};

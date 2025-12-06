interface ProductQuery {
  colors?: string[];
  sizes?: string[];
  categories?: string[];
  tags?: string[];
  maxPrice?: number | undefined;
  minPrice?: number | undefined;
  [key: string]: any;
}

export const buildProductFilterQuery = (query: ProductQuery) => {
  const filter: any = {};

  // Categories (top-level)
  if (query.categories && query.categories.length > 0) {
    filter["categories"] = { $in: query.categories };
  }

  // Tags (top-level)
  if (query.tags && query.tags.length > 0) {
    filter["tags"] = { $in: query.tags };
  }

  // Colors: match any variant with that color
  if (query.colors && query.colors.length > 0) {
    filter["variants"] = {
      ...(filter["variants"] || {}),
      $elemMatch: { color: { $in: query.colors } },
    };
  }

  // Sizes: match if any variant contains a size in the list
  if (query.sizes && query.sizes.length > 0) {
    filter["variants"] = {
      ...(filter["variants"] || {}),
      $elemMatch: { "sizes.size": { $in: query.sizes } },
    };
  }

  // Price range: match if any size price (or inherited price) falls into range.
  // Note: if you use normalizeVariants (stores explicit price per size) you can do:
  if (
    typeof query.minPrice !== "undefined" ||
    typeof query.maxPrice !== "undefined"
  ) {
    const priceCond: any = {};
    if (typeof query.minPrice !== "undefined") priceCond.$gte = query.minPrice;
    if (typeof query.maxPrice !== "undefined") priceCond.$lte = query.maxPrice;

    // Match any variant -> any size with price in range
    filter["variants"] = {
      ...(filter["variants"] || {}),
      $elemMatch: { "sizes.price": priceCond },
    };
  }

  return filter;
};

import { Query } from "mongoose";

interface AllowedQueryFields {
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
  [key: string]: unknown;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

class ApiFeatures<T> {
  query: Query<T[], T>;
  queryStr: AllowedQueryFields;
  meta: Meta | null = null; // <-- Add this line

  constructor(query: Query<T[], T>, queryStr: AllowedQueryFields) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // ---------------------------
  // FILTERING
  // ---------------------------
  filter() {
    const queryObj: Record<string, unknown> = { ...this.queryStr };

    // Add product-specific keys you want to exclude from generic filtering here.
    // This prevents creating wrong top-level filters like { sizes: /S/i }.
    const reserved = [
      "sort",
      "fields",
      "page",
      "limit",
      "search",
      // product-specific (exclude from generic filter)
      "sizes",
      "colors",
      "categories",
      "tags",
      "minPrice",
      "maxPrice",
      "price",
      "price_min",
      "price_max",
    ];
    reserved.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const parsedObj: Record<string, unknown> = JSON.parse(queryString);

    // Convert boolean strings to booleans and leave numeric strings as numbers
    Object.keys(parsedObj).forEach((key) => {
      const value = parsedObj[key];
      if (value === "true") parsedObj[key] = true;
      else if (value === "false") parsedObj[key] = false;
      else if (typeof value === "string" && !isNaN(Number(value))) {
        // numeric string -> convert to number
        parsedObj[key] = Number(value);
      } else if (typeof value === "string") {
        // string -> exact-case-insensitive regex on that top-level field
        parsedObj[key] = { $regex: `^${value}$`, $options: "i" };
      }
    });

    this.query = this.query.find(parsedObj);
    return this;
  }

  // ---------------------------
  // SEARCH
  // ---------------------------
  search(fields: string[]) {
    if (this.queryStr.search && typeof this.queryStr.search === "string") {
      const searchRegex = new RegExp(this.queryStr.search, "i");
      const searchQuery = fields.map((field) => ({ [field]: searchRegex }));
      this.query = this.query.find({ $or: searchQuery });
    }
    return this;
  }

  // ---------------------------
  // SORTING
  // ---------------------------
  sort(defaultSort = "-createdAt") {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  // ---------------------------
  // FIELD LIMITING
  // ---------------------------
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // ---------------------------
  // PAGINATION
  // ---------------------------
  async paginate(defaultLimit = 20) {
    const page = Math.max(Number(this.queryStr.page) || 1, 1);
    const limit = Math.max(Number(this.queryStr.limit) || defaultLimit, 1);
    const skip = (page - 1) * limit;

    const conditions = (this.query as any)._conditions || {};
    const total = await this.query.model.countDocuments(conditions);

    this.meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;

import type { Query, QueryFilter } from "mongoose";

interface QueryParams {
  search?: string;
  keyword?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;

  // Common filters
  category?: string;
  minPrice?: string;
  maxPrice?: string;

  startsWith?: string;
  endsWith?: string;
  contains?: string;

  dateFrom?: string;
  dateTo?: string;

  [key: string]: unknown;
}

class ApiFeaturesAdvanced<T> {
  query: Query<T[], T>;
  queryStr: QueryParams;
  totalDocs = 0;

  constructor(query: Query<T[], T>, queryStr: QueryParams = {}) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // ---------------------------------------------
  // 1. BASIC & ADVANCED SEARCH
  // ---------------------------------------------
  search(fields: string[] = ["name", "title"]) {
    const keyword = this.queryStr.search || this.queryStr.keyword;

    if (keyword) {
      this.query = this.query.find({
        $or: fields.map((f) => ({
          [f]: { $regex: keyword, $options: "i" },
        })),
      });
    }

    return this;
  }

  // ---------------------------------------------
  // 2. FILTER SYSTEM (Range + Operators + Booleans)
  // ---------------------------------------------
  filter() {
    const queryObj = { ...this.queryStr };

    const reserved = [
      "search",
      "keyword",
      "sort",
      "fields",
      "page",
      "limit",
      "minPrice",
      "maxPrice",
      "category",
      "startsWith",
      "endsWith",
      "contains",
      "dateFrom",
      "dateTo",
    ];

    reserved.forEach((e) => delete queryObj[e]);

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    const parsed: QueryFilter<T> = JSON.parse(queryString);

    this.query = this.query.find(parsed);
    return this;
  }

  // ---------------------------------------------
  // 3. CATEGORY FILTER
  // ---------------------------------------------
  category(field = "category") {
    if (this.queryStr.category) {
      this.query = this.query.find({ [field]: this.queryStr.category });
    }
    return this;
  }

  // ---------------------------------------------
  // 4. PRICE RANGE FILTER
  // ---------------------------------------------
  price(field = "price") {
    const min = Number(this.queryStr.minPrice);
    const max = Number(this.queryStr.maxPrice);

    const filter: Record<string, unknown> = {};

    if (!isNaN(min)) filter.$gte = min;
    if (!isNaN(max)) filter.$lte = max;

    if (Object.keys(filter).length > 0) {
      this.query = this.query.find({ [field]: filter });
    }

    return this;
  }

  // ---------------------------------------------
  // 5. TEXT SEARCH (MongoDB $text)
  // ---------------------------------------------
  textSearch() {
    if (this.queryStr.search) {
      this.query = this.query.find({
        $text: { $search: this.queryStr.search as string },
      });
    }
    return this;
  }

  // ---------------------------------------------
  // 6. Starts With / Ends With / Contains
  // ---------------------------------------------
  pattern(field = "name") {
    if (this.queryStr.startsWith) {
      this.query = this.query.find({
        [field]: { $regex: `^${this.queryStr.startsWith}`, $options: "i" },
      });
    }

    if (this.queryStr.endsWith) {
      this.query = this.query.find({
        [field]: { $regex: `${this.queryStr.endsWith}$`, $options: "i" },
      });
    }

    if (this.queryStr.contains) {
      this.query = this.query.find({
        [field]: { $regex: `${this.queryStr.contains}`, $options: "i" },
      });
    }

    return this;
  }

  // ---------------------------------------------
  // 7. DATE RANGE
  // ---------------------------------------------
  dateRange(field = "createdAt") {
    const from = this.queryStr.dateFrom
      ? new Date(this.queryStr.dateFrom)
      : null;
    const to = this.queryStr.dateTo ? new Date(this.queryStr.dateTo) : null;

    const filter: Record<string, unknown> = {};

    if (from) filter.$gte = from;
    if (to) filter.$lte = to;

    if (Object.keys(filter).length > 0) {
      this.query = this.query.find({ [field]: filter });
    }

    return this;
  }

  // ---------------------------------------------
  // 8. SORTING
  // ---------------------------------------------
  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // ---------------------------------------------
  // 9. FIELD LIMITING
  // ---------------------------------------------
  limitFields() {
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.split(",").join(" "));
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // ---------------------------------------------
  // 10. PAGINATION + TOTAL COUNT
  // ---------------------------------------------
  async paginate(defaultLimit = 20) {
    const page = Math.max(Number(this.queryStr.page) || 1, 1);
    const limit = Math.max(Number(this.queryStr.limit) || defaultLimit, 1);
    const skip = (page - 1) * limit;

    this.totalDocs = await this.query.model.countDocuments(
      this.query.getFilter()
    );

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // ---------------------------------------------
  // 11. GET PAGINATION META
  // ---------------------------------------------
  getMeta() {
    return {
      total: this.totalDocs,
      pages: Math.ceil(this.totalDocs / (Number(this.queryStr.limit) || 20)),
      page: Number(this.queryStr.page) || 1,
      limit: Number(this.queryStr.limit) || 20,
    };
  }
}

export default ApiFeaturesAdvanced;

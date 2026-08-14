import { Model, Query } from "mongoose";

interface AllowedQueryFields {
  sort?: string;
  sortBy?: string;
  fields?: string;
  page?: string;
  limit?: string;
  search?: string;
  [key: string]: unknown;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SearchRelation {
  /**
   * Field in the current collection that contains
   * the ObjectId reference.
   *
   * Example:
   * "invitee"
   */
  field: string;

  /**
   * Mongoose model of the referenced collection.
   *
   * Example:
   * User
   */
  model: Model<any>;

  /**
   * Fields in the referenced collection to search.
   *
   * Example:
   * ["name", "email"]
   */
  searchFields: string[];
}

class ApiFeatures<T> {
  query: Query<T[], T>;
  queryStr: AllowedQueryFields;

  meta: Meta | null = null;

  /**
   * All search conditions are stored here.
   *
   * Example:
   *
   * [
   *   { referralCodeUsed: /john/i },
   *   { status: /john/i },
   *   { invitee: { $in: [...] } }
   * ]
   */
  private searchConditions: Record<string, unknown>[] = [];

  constructor(query: Query<T[], T>, queryStr: AllowedQueryFields) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // ---------------------------
  // FILTERING
  // ---------------------------

  filter() {
    const queryObj: Record<string, unknown> = {
      ...this.queryStr,
    };

    /**
     * Fields that should NOT be treated as
     * normal MongoDB filters.
     */
    const reserved = [
      "sort",
      "sortBy",
      "fields",
      "page",
      "limit",
      "search",

      // Product-specific
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

    reserved.forEach((field) => {
      delete queryObj[field];
    });

    // Convert:
    // gte -> $gte
    // gt  -> $gt
    // lte -> $lte
    // lt  -> $lt

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    const parsedObj: Record<string, unknown> = JSON.parse(queryString);

    /**
     * Convert query values:
     *
     * "true"  -> true
     * "false" -> false
     * "100"   -> 100
     * "abc"   -> /^abc$/i
     */
    Object.keys(parsedObj).forEach((key) => {
      const value = parsedObj[key];

      if (value === "true") {
        parsedObj[key] = true;
      } else if (value === "false") {
        parsedObj[key] = false;
      } else if (typeof value === "string" && !isNaN(Number(value))) {
        parsedObj[key] = Number(value);
      } else if (typeof value === "string") {
        parsedObj[key] = {
          $regex: `^${this.escapeRegex(value)}$`,
          $options: "i",
        };
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
      const searchRegex = new RegExp(
        this.escapeRegex(this.queryStr.search),
        "i",
      );

      const conditions = fields.map((field) => ({
        [field]: searchRegex,
      }));

      this.addSearchConditions(conditions);
    }

    return this;
  }

  // ---------------------------
  // SEARCH RELATIONS
  // ---------------------------

  async searchRelations(relations: SearchRelation[]) {
    if (!this.queryStr.search || typeof this.queryStr.search !== "string") {
      return this;
    }

    const searchRegex = new RegExp(this.escapeRegex(this.queryStr.search), "i");

    const relationConditions = await Promise.all(
      relations.map(async (relation) => {
        /**
         * Search the referenced collection.
         *
         * Example:
         *
         * User.find({
         *   $or: [
         *     { name: /john/i },
         *     { email: /john/i }
         *   ]
         * })
         */
        const relatedDocuments = await relation.model
          .find({
            $or: relation.searchFields.map((field) => ({
              [field]: searchRegex,
            })),
          })
          .select("_id")
          .lean();

        const ids = relatedDocuments.map((document) => document._id);

        /**
         * Convert matching users into a condition
         * for the main collection.
         *
         * Example:
         *
         * {
         *   invitee: {
         *     $in: [...]
         *   }
         * }
         */
        return {
          [relation.field]: {
            $in: ids,
          },
        };
      }),
    );

    this.addSearchConditions(relationConditions);

    return this;
  }

  // ---------------------------
  // ADD SEARCH CONDITIONS
  // ---------------------------

  private addSearchConditions(conditions: Record<string, unknown>[]) {
    this.searchConditions.push(...conditions);

    /**
     * Rebuild the search query using ALL search
     * conditions.
     *
     * Example:
     *
     * {
     *   $or: [
     *     { referralCodeUsed: /john/i },
     *     { status: /john/i },
     *     { invitee: { $in: [...] } }
     *   ]
     * }
     */
    if (this.searchConditions.length > 0) {
      this.query = this.query.find({
        $or: this.searchConditions,
      });
    }

    return this;
  }

  // ---------------------------
  // ESCAPE REGEX
  // ---------------------------

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ---------------------------
  // SORTING
  // ---------------------------

  sort(defaultSort = "-createdAt") {
    const sortBy = this.queryStr.sortBy;

    if (typeof sortBy === "string") {
      switch (sortBy) {
        // -------------------------
        // General
        // -------------------------

        case "newest":
          this.query = this.query.sort({
            createdAt: -1,
          });
          break;

        case "oldest":
          this.query = this.query.sort({
            createdAt: 1,
          });
          break;

        // -------------------------
        // Product
        // -------------------------

        case "price_asc":
          this.query = this.query.sort({
            baseSellingPrice: 1,
          });
          break;

        case "price_desc":
          this.query = this.query.sort({
            baseSellingPrice: -1,
          });
          break;

        case "featured":
          this.query = this.query.sort({
            featured: -1,
            createdAt: -1,
          });
          break;

        // -------------------------
        // Referral
        // -------------------------

        case "reward_asc":
          this.query = this.query.sort({
            rewardAmount: 1,
          });
          break;

        case "reward_desc":
          this.query = this.query.sort({
            rewardAmount: -1,
          });
          break;

        case "status":
          this.query = this.query.sort({
            status: 1,
          });
          break;

        default:
          this.query = this.query.sort(defaultSort);
      }
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

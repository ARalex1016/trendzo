import type { ICategory } from "./category.type";
import type { IProduct } from "./product.type";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IProductResponse {
  status: string;
  message: string;
  meta: Meta;
  data: IProduct[];
}

export interface ICategoryResponse {
  status: string;
  message: string;
  meta: Meta;
  data: ICategory[];
}

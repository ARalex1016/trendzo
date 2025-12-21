export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  discount?: number;
  specifications?: Record<string, any>;
  variants?: any[];
  categories: string[];
  tags?: string[];
}

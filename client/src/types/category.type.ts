export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  parentCategory?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

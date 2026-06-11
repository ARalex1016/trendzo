export interface ICategoryBase {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends ICategoryBase {
  parentCategory: string | null;
}

export type IChildCategory = ICategory;

export interface IParentCategory extends ICategoryBase {
  parentCategory: null;
}

export interface ICategoryTree extends IParentCategory {
  children: IChildCategory[];
}

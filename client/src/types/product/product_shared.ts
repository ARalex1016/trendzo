export interface IInventory {
  color: string; // ObjectId of Color
  size: string; // ObjectId of Size
  stock: number;
}

export interface IImage {
  url: string;
  publicId: string;
}

export interface IProductSpecifications {
  weight?: number;
  material?: string;
  countryOfOrigin?: string;
  warranty?: string;
}

export interface ISuggestion {
  name: string;
  slug: string;
}

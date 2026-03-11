export interface ISize {
  _id: string;

  name: string;
  slug: string;

  type: "alpha" | "numeric" | "shoe" | "custom";

  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    height?: number;
    width?: number;
    depth?: number;
  };

  unit?: "cm" | "inch";

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

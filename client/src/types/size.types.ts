export type SizeType = "alpha" | "numeric" | "shoe" | "custom";

export type SizeUnit = "cm" | "inch";

export interface SizeMeasurements {
  chest?: number;
  waist?: number;
  length?: number;
  height?: number;
  width?: number;
  depth?: number;
}

export type Creator = {
  name: string;
};

export interface ISize {
  _id: string;

  name: string;
  slug: string;

  type: SizeType;

  measurements?: SizeMeasurements;

  unit?: SizeUnit;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AdminSize extends Omit<ISize, "createdBy"> {
  createdBy: Creator;
}

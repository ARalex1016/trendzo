export interface IColor {
  _id: string;

  name: string;
  slug: string;
  hexCode: string;
  rgb?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

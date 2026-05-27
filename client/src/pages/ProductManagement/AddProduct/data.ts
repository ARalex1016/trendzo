// Steps
import Basicinfo, { basicInfoSchema } from "./Steps/BasicInfo";
import Media, { mediaSchema } from "./Steps/Media";
import Pricing, { pricingSchema } from "./Steps/Pricing";
import ColorsNSizes, { colorsNSizeSchema } from "./Steps/ColorNSizes";
import Inventory, { inventorySchema } from "./Steps/Inventory";
import Categories, { categoriesSchema } from "./Steps/Categories";
import Specifications, { specificationsSchema } from "./Steps/Specifications";
import Visibility, { visibilitySchema } from "./Steps/Visibility";

// Icons
import {
  Boxes,
  CircleDollarSign,
  FileText,
  ImagePlus,
  Info,
  Palette,
  Rocket,
  Tag,
} from "lucide-react";

// Types
import type { Step } from "@/hooks/useMultiStepForm";

export const steps: Step[] = [
  {
    id: "basic",
    label: "Basic Info",
    text: "Name, slug, description",
    icon: FileText,
    component: Basicinfo,
    schema: basicInfoSchema,
  },
  {
    id: "media",
    label: "Media",
    text: "Images & thumbnail",
    icon: ImagePlus,
    component: Media,
    schema: mediaSchema,
  },
  {
    id: "pricing",
    label: "Pricing",
    text: "Cost, sale & margin",
    icon: CircleDollarSign,
    component: Pricing,
    schema: pricingSchema,
  },
  {
    id: "variants",
    label: "Colors & sizes",
    text: "Variant matrix",
    icon: Palette,
    component: ColorsNSizes,
    schema: colorsNSizeSchema,
  },
  {
    id: "inventory",
    label: "Inventory",
    text: "Stock per variant",
    icon: Boxes,
    component: Inventory,
    schema: inventorySchema,
  },
  {
    id: "categories",
    label: "Categories",
    text: "Taxonomy & tags",
    icon: Tag,
    component: Categories,
    schema: categoriesSchema,
  },
  {
    id: "specifications",
    label: "Specifications",
    text: "Weight, material…",
    icon: Info,
    component: Specifications,
    schema: specificationsSchema,
  },
  {
    id: "visibility",
    label: "Visibility",
    text: "Publish settings",
    icon: Rocket,
    component: Visibility,
    schema: visibilitySchema,
  },
];

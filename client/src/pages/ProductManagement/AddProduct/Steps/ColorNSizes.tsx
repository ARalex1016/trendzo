// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const colorsNSizeSchema = addProductSchema.pick({});

const ColorsNSizes = () => {
  return <div>ColorNSizes</div>;
};

export default ColorsNSizes;

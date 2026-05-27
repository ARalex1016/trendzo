// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const visibilitySchema = addProductSchema.pick({
  featured: true,
  isActive: true,
});

const Visibility = () => {
  return <div>Visibility</div>;
};

export default Visibility;

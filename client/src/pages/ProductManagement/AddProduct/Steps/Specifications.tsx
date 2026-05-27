// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const specificationsSchema = addProductSchema.pick({
  specifications: true,
});

const Specifications = () => {
  return <div>Specifications</div>;
};

export default Specifications;

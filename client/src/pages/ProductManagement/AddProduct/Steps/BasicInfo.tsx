// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const basicInfoSchema = addProductSchema.pick({
  name: true,
  slug: true,
  description: true,
});

const Basicinfo = () => {
  return <div>Basicinfo</div>;
};

export default Basicinfo;

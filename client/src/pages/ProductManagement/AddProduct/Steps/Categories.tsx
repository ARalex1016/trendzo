// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const categoriesSchema = addProductSchema.pick({
  categories: true,
});

const Categories = () => {
  return <div>Categories</div>;
};

export default Categories;

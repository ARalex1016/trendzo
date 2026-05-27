// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const pricingSchema = addProductSchema.pick({
  baseCostPrice: true,
  baseSellingPrice: true,
  discount: true,
});

const Pricing = () => {
  return <div>Pricing</div>;
};

export default Pricing;

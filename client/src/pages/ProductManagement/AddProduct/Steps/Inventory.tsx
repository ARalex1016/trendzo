// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const inventorySchema = addProductSchema.pick({
  inventory: true,
});

const Inventory = () => {
  return <div>Inventory</div>;
};

export default Inventory;

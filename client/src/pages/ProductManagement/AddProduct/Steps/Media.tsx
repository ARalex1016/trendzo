// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const mediaSchema = addProductSchema.pick({
  images: true,
  thumbnail: true,
});

const Media = () => {
  return <div>Media</div>;
};

export default Media;

import z from "zod";
import { useFormContext, useWatch } from "react-hook-form";

// Store
import useAttributeStore from "@/store/useAttributeStore";

// Validations
import {
  addProductSchema,
  type AddProductType,
} from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const inventorySchema = addProductSchema.pick({
  inventory: true,
});

export type InventorySchemaType = z.infer<typeof inventorySchema>;

const InventoryTable = () => {
  const { control } = useFormContext<AddProductType>();

  const { attributes } = useAttributeStore();

  const colors = useWatch({
    control,
    name: "colors",
  });

  const sizes = useWatch({
    control,
    name: "sizes",
  });

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>Color / Size</th>

          {sizes &&
            sizes.map((sizeId) => (
              <th key={sizeId}>
                {attributes?.sizes.find((size) => size._id === sizeId)?.name}
              </th>
            ))}
        </tr>
      </thead>

      <tbody>
        {colors &&
          colors.map((colorId) => (
            <tr key={colorId}>
              <th>
                {
                  attributes?.colors.find((color) => color._id === colorId)
                    ?.name
                }
              </th>

              {/* {sizes.map((size) => {
              const variant = inventory.find(
                (item) => item.color === color && item.size === size,
              );

              return <td key={`${color}-${size}`}>{variant?.stock ?? 0}</td>;
            })} */}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const Inventory = () => {
  const form = useFormContext<InventorySchemaType>();

  return (
    <div>
      <InventoryTable />
    </div>
  );
};

export default Inventory;

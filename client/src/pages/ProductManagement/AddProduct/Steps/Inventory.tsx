import { useState, useMemo } from "react";
import z from "zod";
import { useFormContext, useWatch } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StatusBadge } from "@/components/Badges/StatusBadge";

// Icons
import { Layers, Sparkles, Boxes } from "lucide-react";

// Lib
import { cn } from "@/lib/utils";

// Store
import useAttributeStore from "@/store/useAttributeStore";

// Validations
import {
  addProductSchema,
  // type AddProductType,
} from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const inventorySchema = addProductSchema.pick({
  inventory: true,
  colors: true,
  sizes: true,
});

export type InventorySchemaType = z.infer<typeof inventorySchema>;

const NoVariant = () => {
  return (
    <div className="bg-accent flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-gradient from-neon-purple/20 to-neon-blue/20 ring-1 ring-white/10">
        <Layers className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold">Pick colors & sizes first</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The inventory matrix generates automatically once you've selected
        variants in the previous step.
      </p>
    </div>
  );
};

const InventoryTable = () => {
  const { colorMap, sizeMap } = useAttributeStore();
  const form = useFormContext<InventorySchemaType>();

  const [activeCell, setActiveCell] = useState<{
    colorId: string | null;
    sizeId: string | null;
  }>({
    colorId: null,
    sizeId: null,
  });

  const { control } = form;

  const colors = useWatch({
    control,
    name: "colors",
  });

  const sizes = useWatch({
    control,
    name: "sizes",
  });

  const inventory = useWatch({
    control,
    name: "inventory",
  });

  const matrix = useMemo(() => {
    return colors.flatMap((colorId) =>
      sizes.map((sizeId) => ({
        key: `${colorId}-${sizeId}`,
        colorId,
        sizeId,
        color: colorMap[colorId],
        size: sizeMap[sizeId],
      })),
    );
  }, [colors, sizes, colorMap, sizeMap]);

  const inventoryLookup = useMemo(() => {
    const map = new Map<string, number>();

    inventory?.forEach((item) => {
      map.set(`${item.color}-${item.size}`, item.stock);
    });

    return map;
  }, [inventory]);

  const rowTotals = useMemo(() => {
    const totals = new Map<string, number>();

    inventory?.forEach((item) => {
      totals.set(item.color, (totals.get(item.color) || 0) + item.stock);
    });

    return totals;
  }, [inventory]);

  if (!matrix.length) {
    return <NoVariant />;
  }

  return (
    <div className="max-w-full overflow-x-auto no-scrollbar rounded-xl border border-border">
      <table border={1} className="rounded-xl w-max">
        <thead>
          <tr>
            <th className="text-xs md:text-sm font-medium bg-accent p-2">
              COLOR / SIZE
            </th>

            {sizes &&
              sizes.map((sizeId) => {
                const focusedSize = activeCell.sizeId === sizeId;

                return (
                  <th
                    key={sizeId}
                    className={cn(
                      "min-w-24 text-xs md:text-sm px-2 py-3 border-x border-x-border transition-all duration-200",
                      focusedSize ? "bg-primary/20" : "bg-accent",
                    )}
                  >
                    {sizeMap[sizeId]?.name}
                  </th>
                );
              })}

            <th className="bg-accent px-3 py-2 font-semibold">Row Total</th>
          </tr>
        </thead>

        <tbody>
          {colors &&
            colors.map((colorId) => {
              const focusedColor = activeCell.colorId === colorId;

              return (
                <tr key={colorId}>
                  <td
                    className={cn(
                      "w-20 md:w-36 px-3 border-y border-y-border transition-all duration-200",
                      focusedColor ? "bg-primary/20" : "bg-accent",
                    )}
                  >
                    <div className="flex justify-start gap-x-2 items-center">
                      <span
                        className="size-3 md:size-4 rounded-full border-2 border-border"
                        style={{
                          backgroundColor: colorMap[colorId]?.hexCode,
                        }}
                      ></span>

                      <p className="text-xs md:text-sm font-medium">
                        {colorMap[colorId]?.name}
                      </p>
                    </div>
                  </td>

                  {sizes.map((sizeId) => {
                    const key = `${colorId}-${sizeId}`;
                    const value = inventoryLookup.get(key);
                    const focusedSize = activeCell.sizeId === sizeId;
                    const focusedData =
                      activeCell.sizeId === sizeId &&
                      activeCell.colorId === colorId;

                    return (
                      <td
                        key={key}
                        className={cn(
                          "p-2 transition-all duration-200",
                          focusedData
                            ? "bg-primary/20"
                            : (focusedColor || focusedSize) && "bg-primary/10",
                        )}
                      >
                        <input
                          type="number"
                          min={0}
                          value={value ?? ""}
                          onFocus={() => setActiveCell({ colorId, sizeId })}
                          onBlur={() =>
                            setActiveCell({ colorId: null, sizeId: null })
                          }
                          className="w-20 bg-background/40 border-2 px-2 py-1 rounded outline-none focus:border-primary transition-all duration-200"
                          onChange={(e) => {
                            const raw = e.target.value;

                            const current = inventory || [];

                            // 1. EMPTY VALUE = REMOVE ITEM
                            if (raw === "") {
                              const updated = current.filter(
                                (i) =>
                                  !(i.color === colorId && i.size === sizeId),
                              );

                              form.setValue("inventory", updated, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });

                              return;
                            }

                            // 2. Convert safely
                            const stock = Number(raw);

                            // 3. Prevent invalid numbers only (NOT 0 check)
                            if (Number.isNaN(stock) || stock < 0) return;

                            const exists = current.find(
                              (i) => i.color === colorId && i.size === sizeId,
                            );

                            let updated;

                            if (exists) {
                              updated = current.map((i) =>
                                i.color === colorId && i.size === sizeId
                                  ? { ...i, stock }
                                  : i,
                              );
                            } else {
                              updated = [
                                ...current,
                                { color: colorId, size: sizeId, stock },
                              ];
                            }

                            form.setValue("inventory", updated, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      </td>
                    );
                  })}

                  <td
                    className={cn(
                      "px-3 py-2 font-semibold border border-border",
                      focusedColor && "bg-primary/10",
                    )}
                  >
                    {rowTotals.get(colorId) || 0}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const Inventory = () => {
  const form = useFormContext<InventorySchemaType>();

  const { colors, sizes, inventory } = form.watch();

  const totalPossibleVariants = colors.length * sizes.length;

  const totalUsedVariants = inventory.length;

  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-5">
        {/* StatusBadges */}
        <div className="w-full flex flex-row gap-x-3">
          <StatusBadge
            variant="gray"
            glow={false}
            className="flex-1 flex flex-col items-start gap-y-2 px-4 py-3 rounded-2xl!"
          >
            <div className="flex flex-row items-center gap-x-2">
              <Layers className="size-4 text-foreground/60" />

              <p className="text-foreground/60">Variants</p>
            </div>

            <p className="text-xl text-foreground font-medium">
              {totalPossibleVariants}
            </p>
          </StatusBadge>

          <StatusBadge
            variant="gray"
            glow={false}
            className="flex-1 flex flex-col items-start gap-y-2 px-4 py-3 rounded-2xl!"
          >
            <div className="flex flex-row items-center gap-x-2">
              <Sparkles className="size-4 text-foreground/60" />

              <p className="text-foreground/60">With stock</p>
            </div>

            <p className="text-xl text-foreground font-medium">
              {totalUsedVariants}/{totalPossibleVariants}
            </p>
          </StatusBadge>

          <StatusBadge
            variant="gray"
            glow={false}
            className="flex-1 flex flex-col items-start gap-y-2 px-4 py-3 rounded-2xl!"
          >
            <div className="flex flex-row items-center gap-x-2">
              <Boxes className="size-4 text-foreground/60" />

              <p className="text-foreground/60">Total Stock</p>
            </div>

            <p className="text-xl text-primary font-bold">{totalStock}</p>
          </StatusBadge>
        </div>

        <InventoryTable />
      </div>
    </Form>
  );
};

export default Inventory;

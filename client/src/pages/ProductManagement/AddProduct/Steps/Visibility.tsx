import z from "zod";
import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem } from "@/components/ui/form";
import SwitchCard from "@/components/SwitchCard";

// Icons
import { Star, Eye, Crown, Check, ImageIcon } from "lucide-react";

// Lib
import { cn } from "@/lib/utils";

// Validations
import {
  addProductSchema,
  type AddProductType,
} from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const visibilitySchema = addProductSchema.pick({
  featured: true,
  isActive: true,
});

export type VisibilitySchemaType = z.infer<typeof visibilitySchema>;

const Visibility = () => {
  const form = useFormContext<VisibilitySchemaType>();

  const draft = useFormContext<AddProductType>().watch();

  const totalStock = draft.inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <Form {...form}>
      <div className="grid lg:grid-cols-5 gap-6 ">
        {/* Switches */}
        <div className="space-y-4 lg:col-span-3">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <SwitchCard
                  title="Featured Product"
                  text="Show on homepage"
                  isActive={field.value ?? false}
                  onChange={field.onChange}
                  variant={field.value ? "warning" : "default"}
                  icon={Star}
                  activeStateName="Featured"
                  activeStateIcon={Crown}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <SwitchCard
                  title="Active Product"
                  text="Visible to customers"
                  isActive={field.value ?? false}
                  onChange={field.onChange}
                  variant={field.value ? "success" : "default"}
                  icon={Eye}
                  activeStateName="Active"
                  activeStateIcon={Check}
                />
              </FormItem>
            )}
          />

          <div className="bg-background/40 rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Final checks
            </p>

            <ul className="mt-3 space-y-2 text-sm">
              <CheckSign ok={!!draft.name} label="Product name set" />
              <CheckSign
                ok={draft.images?.length > 0}
                label={`${draft.images?.length ?? 0} image(s) uploaded`}
              />
              <CheckSign
                ok={
                  Number(draft.baseSellingPrice) > 0 &&
                  Number(draft.baseSellingPrice) >= Number(draft.baseCostPrice)
                }
                label="Pricing valid"
              />
              <CheckSign
                ok={totalStock > 0}
                label={`${totalStock} units in inventory`}
              />
              <CheckSign
                ok={draft?.categories?.length > 0}
                label="Category assigned"
              />
            </ul>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Live preview
          </p>

          <div className="bg-background/40 overflow-hidden rounded-3xl p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-background ring-1 ring-white/5">
              {draft?.thumbnail ? (
                <img
                  src={draft.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 opacity-30" />
                </div>
              )}
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {draft.featured && (
                  <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-warning backdrop-blur">
                    <Star className="h-2.5 w-2.5 fill-warning" /> Featured
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-semibold backdrop-blur",
                    draft.isActive
                      ? "bg-success/20 text-success ring-1 ring-success/40"
                      : "bg-muted/40 text-muted-foreground",
                  )}
                >
                  {draft.isActive ? "Active" : "Draft"}
                </span>
              </div>
            </div>
            <div className="px-2 pb-2 pt-4">
              <h4 className="truncate text-base font-semibold">
                {draft.name || "Untitled product"}
              </h4>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {/* {draft.categories > 0
                ? CATEGORY_LIBRARY.find((c) => c.id === draft.categories[0])?.path
                : "No category"} */}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-semibold gradient-text tabular-nums">
                  {/* ${finalPrice.toFixed(2)} */}
                </span>
                {draft?.discount &&
                  draft?.discount > 0 &&
                  draft.baseSellingPrice > 0 && (
                    <>
                      <span className="text-xs text-muted-foreground line-through tabular-nums">
                        ${draft.baseSellingPrice.toFixed(2)}
                      </span>
                      <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                        -{draft.discount}%
                      </span>
                    </>
                  )}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Eye className="h-3 w-3" /> Preview as customer
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Visibility;

const CheckSign = ({ ok, label }: { ok: boolean; label: string }) => {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
          ok
            ? "bg-success/20 text-success"
            : "bg-white/5 text-muted-foreground",
        )}
      >
        {ok ? "✓" : "•"}
      </span>
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </li>
  );
};

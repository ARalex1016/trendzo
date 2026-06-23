import z from "zod";
import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem } from "@/components/ui/form";
import SwitchCard from "@/components/SwitchCard";

// Icons
import { Star, Eye, Crown, Check, ImageIcon } from "lucide-react";

// Config
import { BRAND } from "@/config/brand";

// Lib
import { cn } from "@/lib/utils";

// Utils
import { capitalize } from "@/utils/StringManager";

// Store
import useCategoryStore from "@/store/useCategoryStore";

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
      <div className="grid lg:grid-cols-7 gap-6 ">
        {/* Switches */}
        <div className="space-y-3 lg:col-span-4">
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

          {/* Final checks */}
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
        <LivePreview />
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

const LivePreview = () => {
  const { categoryMap } = useCategoryStore();

  const draft = useFormContext<AddProductType>().watch();

  const thumbnail = draft.thumbnail
    ? URL.createObjectURL(
        draft.images.filter((image) => image.id === draft.thumbnail)[0].file,
      )
    : "";

  const finalPrice = draft.discount
    ? draft.baseSellingPrice - (draft.discount / 100) * draft.baseSellingPrice
    : (draft.baseSellingPrice ?? 0);

  return (
    <div className="lg:col-span-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Live preview
      </p>

      <div className="bg-background/40 overflow-hidden rounded-3xl p-3">
        {/* Image */}
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-linear-to-br from-surface to-background ring-1 ring-white/5">
          {draft?.thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-30" />
            </div>
          )}

          {/* Layer */}
          <div className="w-full h-full bg-linear-to-b from-background/90 to-transparent absolute top-0" />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {draft.featured && (
              <span className="flex items-center gap-1 rounded-full bg-info/15 border border-info/30 text-info px-2 py-1 text-[10px] font-semibold text-warning backdrop-blur">
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

        {/* Preview Details */}
        <div className="px-2 pb-2 pt-4">
          <h4 className="truncate text-base font-semibold">
            {draft.name || "Untitled product"}
          </h4>

          {/* Categories */}
          <div className="flex flex-row items-center flex-nowrap gap-x-2 pt-0.5">
            {draft.categories?.length > 0 ? (
              <>
                {draft.categories.slice(0, 2).map((categoryId) => (
                  <p
                    key={categoryId}
                    className="truncate text-xs text-muted-foreground"
                  >
                    {capitalize(categoryMap[categoryId].name)}
                  </p>
                ))}

                {draft.categories.length > 2 && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    +{draft.categories.length - 2} more
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No Category</p>
            )}
          </div>

          {/* Prices */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg text-primary-gradient font-semibold gradient-text tabular-nums">
              {BRAND.currency.symbol}
              {finalPrice.toFixed(2)}
            </span>

            {draft?.discount &&
              draft?.discount > 0 &&
              draft.baseSellingPrice > 0 && (
                <>
                  <span className="text-xs text-muted-foreground line-through tabular-nums">
                    ${Number(draft.baseSellingPrice).toFixed(2)}
                  </span>

                  <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                    -{draft.discount}%
                  </span>
                </>
              )}
          </div>

          {/* <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Eye className="h-3 w-3" /> Preview as customer
          </div> */}
        </div>
      </div>
    </div>
  );
};

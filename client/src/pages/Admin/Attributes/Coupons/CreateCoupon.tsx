import { useState, forwardRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Components
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Plus,
  Percent,
  DollarSign,
  Users,
  CalendarDays,
  Tag,
  Hash,
  Infinity,
} from "lucide-react";

// Hooks

// Validators
import { createCouponSchema } from "@/validations/coupon.validator";

// Store
import useCouponStore from "@/store/useCouponStore";

type CreateCouponFormInput = z.input<typeof createCouponSchema>;
export type CreateCouponFormValues = z.output<typeof createCouponSchema>;

interface CreateCouponFormProps {
  onSubmit?: (data: CreateCouponFormValues) => Promise<void> | void;
  onClose?: () => void;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export const CreateCoupon = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [creatingCoupon, setCreatingCoupon] = useState<boolean>(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={false}
      swipeDirection="right"
    >
      <DrawerTrigger>
        <CreateCouponButton />
      </DrawerTrigger>

      <DrawerContent className="bg-card flex h-full max-h-screen flex-col">
        {/* Header */}
        <DrawerHeader className="shrink-0 bg-accent/80 px-6 py-3">
          <DrawerTitle className="text-foreground font-medium">
            Create Coupon
          </DrawerTitle>

          <DrawerDescription className="text-foreground/60 text-sm">
            Add a new promotional coupon
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Scrollable middle */}
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <div className="px-6 py-3">
            <CreateCouponForm
              onClose={() => setOpen(false)}
              loading={creatingCoupon}
              onLoadingChange={setCreatingCoupon}
            />
          </div>
        </div>

        {/* Fixed footer */}
        <DrawerFooter className="shrink-0 bg-accent/80 border-t border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <DrawerClose
              className={
                "text-sm font-medium text-foreground/60 bg-accent/60 border border-border rounded-md hover:text-foreground hover:bg-accent transition-all duration-200 px-6 py-2"
              }
            >
              Cancel
            </DrawerClose>

            <button
              type="submit"
              disabled={creatingCoupon}
              form="create-coupon-form"
              className="rounded-md bg-primary/80 px-6 py-2 text-sm font-semibold text-foreground/80 transition-all duration-200 hover:bg-primary hover:text-foreground enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Coupon
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const CreateCouponButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="text-sm sm:text-base text-nowrap font-medium bg-primary/80 rounded-lg flex flex-row items-center gap-x-1 sm:gap-x-2 p-2.5 sm:px-4 sm:py-1.5 hover:bg-primary hover:-translate-y-1 transition-all duration-200"
    >
      <Plus className="size-6 sm:size-5" />

      <span className="hidden sm:inline">Create Coupon</span>
    </button>
  );
});

export const CreateCouponForm = ({
  onSubmit,
  loading = false,
  onLoadingChange,
}: CreateCouponFormProps) => {
  const { createCoupon } = useCouponStore();

  const form = useForm<CreateCouponFormInput, unknown, CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: undefined,
      applicableUsers: "all",
      expiryDate: undefined,
      usageLimit: 0,
      status: "active",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const discountType = watch("type");
  const applicableUsers = watch("applicableUsers");
  const usageLimit = watch("usageLimit");
  const status = watch("status");

  const unlimitedUsage = usageLimit === 0;

  const submitHandler = async (data: CreateCouponFormValues) => {
    onLoadingChange?.(true);

    try {
      await onSubmit?.(data);

      await createCoupon(data);
    } catch (error) {
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form
      id="create-coupon-form"
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-3 sm:space-y-4"
    >
      {/* =========================================================
          Coupon Code
      ========================================================= */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Coupon Code
        </label>

        <div className="relative">
          <Tag className="absolute left-3 top-1/2 size-3.5 sm:size-4 -translate-y-1/2 text-zinc-500" />

          <input
            {...register("code")}
            placeholder="e.g. SUMMER25"
            className={inputClass(errors.code)}
          />
        </div>

        <ErrorMessage message={errors.code?.message} />
      </div>

      {/* =========================================================
          Discount
      ========================================================= */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">
            Discount
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Choose how the coupon discount should be calculated.
          </p>
        </div>

        {/* Type Tabs */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
              <TabButton
                active={field.value === "percentage"}
                onClick={() => field.onChange("percentage")}
                icon={<Percent className="size-4" />}
              >
                Percentage
              </TabButton>

              <TabButton
                active={field.value === "fixed"}
                onClick={() => field.onChange("fixed")}
                icon={<DollarSign className="size-4" />}
              >
                Fixed Amount
              </TabButton>
            </div>
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* Discount Value */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Discount Value
            </label>

            <div className="relative">
              {discountType === "percentage" ? (
                <Percent className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              )}

              <input
                type="number"
                min="0"
                step="0.01"
                {...register("value", {
                  valueAsNumber: true,
                })}
                placeholder={
                  discountType === "percentage" ? "e.g. 20" : "e.g. 500"
                }
                className={inputClass(errors.value)}
              />
            </div>

            <ErrorMessage message={errors.value?.message} />
          </div>

          {/* Max Discount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Max Discount
              <span className="ml-2 text-xs font-normal text-zinc-500">
                Optional
              </span>
            </label>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="number"
                min="0"
                step="0.01"
                {...register("maxDiscount", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                placeholder="No maximum"
                className={inputClass(errors.maxDiscount)}
              />
            </div>

            <ErrorMessage message={errors.maxDiscount?.message} />
          </div>
        </div>
      </div>

      {/* =========================================================
          Minimum Purchase
      ========================================================= */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Minimum Purchase
        </label>

        <p className="text-xs text-zinc-500">
          Minimum order amount required to use this coupon.
        </p>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

          <input
            type="number"
            min="0"
            step="0.01"
            {...register("minPurchase", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className={inputClass(errors.minPurchase)}
          />
        </div>

        <ErrorMessage message={errors.minPurchase?.message} />
      </div>

      {/* =========================================================
          Applicable Users
      ========================================================= */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-sm font-medium text-white">
            Applicable Users
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Choose who can use this coupon.
          </p>
        </div>

        <Controller
          name="applicableUsers"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
              <TabButton
                active={field.value === "all"}
                onClick={() => field.onChange("all")}
              >
                All Users
              </TabButton>

              <TabButton
                active={field.value === "firstTime"}
                onClick={() => field.onChange("firstTime")}
              >
                First-time Users
              </TabButton>
            </div>
          )}
        />

        <ErrorMessage message={errors.applicableUsers?.message} />
      </div>

      {/* =========================================================
          Usage Limit
      ========================================================= */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-x-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-2.5 py-4 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800">
              <Infinity className="size-3.5 sm:size-4 text-foreground" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium text-white">
                Unlimited Usage
              </p>

              <p className="text-xs text-zinc-500">
                Allow unlimited uses of this coupon.
              </p>
            </div>
          </div>

          <Switch
            checked={unlimitedUsage}
            onCheckedChange={(checked) => {
              setValue("usageLimit", checked ? 0 : 1, {
                shouldValidate: true,
              });
            }}
          />
        </div>

        {!unlimitedUsage && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Maximum Number of Uses
            </label>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="number"
                min="1"
                step="1"
                {...register("usageLimit", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                placeholder="e.g. 100"
                className={inputClass(errors.usageLimit)}
              />
            </div>

            <ErrorMessage message={errors.usageLimit?.message} />
          </div>
        )}
      </div>

      {/* =========================================================
          Expiry Date
      ========================================================= */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Expiry Date</label>

        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

          <input
            type="date"
            {...register("expiryDate")}
            className={inputClass(errors.expiryDate)}
          />
        </div>

        <ErrorMessage message={errors.expiryDate?.message} />
      </div>

      {/* =========================================================
          Status
      ========================================================= */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-2.5 py-4 sm:p-4">
        <div>
          <p className="text-sm font-medium text-white">Coupon Status</p>

          <p className="mt-1 text-xs text-zinc-500">
            Inactive coupons cannot be used by customers.
          </p>
        </div>

        <Switch
          checked={status === "active"}
          onCheckedChange={(checked) => {
            setValue("status", checked ? "active" : "inactive", {
              shouldValidate: true,
            });
          }}
        />
      </div>
    </form>
  );
};

/* =========================================================
   Tab Button
========================================================= */

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function TabButton({ active, onClick, icon, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[10px] sm:text-sm text-nowrap font-medium transition ${
        active
          ? "bg-zinc-800 text-white shadow-sm"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {icon && icon}
      {children}
    </button>
  );
}

/* =========================================================
   Switch
========================================================= */

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/* =========================================================
   Helpers
========================================================= */

function inputClass(error?: unknown) {
  return `w-full rounded-xl border bg-zinc-900/60 py-2 sm:py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 ${
    error
      ? "border-red-500/50 focus:border-red-500"
      : "border-zinc-800 focus:border-zinc-600"
  }`;
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs text-destructive">{message}</p>;
}

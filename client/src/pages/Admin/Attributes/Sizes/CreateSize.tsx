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
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Plus,
  Ruler,
  Shirt,
  Footprints,
  Hash,
  Settings2,
  ToggleLeft,
} from "lucide-react";

// Validators
import { createSizeSchema } from "@/validations/size.validator";

// Store
import useSizeStore from "@/store/useSizeStore";

type CreateSizeFormInput = z.input<typeof createSizeSchema>;
export type CreateSizeFormValues = z.output<typeof createSizeSchema>;

interface CreateSizeFormProps {
  onSubmit?: (data: CreateSizeFormValues) => Promise<void> | void;
  onClose?: () => void;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export const CreateSize = () => {
  const [open, setOpen] = useState(false);
  const [creatingSize, setCreatingSize] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={false}
      swipeDirection="right"
    >
      <CreateSizeButton onClick={() => setOpen(true)} />

      <DrawerContent className="bg-card flex h-full max-h-screen flex-col">
        {/* Header */}
        <DrawerHeader className="shrink-0 bg-accent/80 px-6 py-3">
          <DrawerTitle className="font-medium text-foreground">
            Create Size
          </DrawerTitle>

          <DrawerDescription className="text-sm text-foreground/60">
            Add a new product size
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <div className="px-6 py-3">
            <CreateSizeForm
              onClose={() => setOpen(false)}
              loading={creatingSize}
              onLoadingChange={setCreatingSize}
            />
          </div>
        </div>

        {/* Footer */}
        <DrawerFooter className="shrink-0 border-t border-zinc-800 bg-accent/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <DrawerClose className="rounded-md border border-border bg-accent/60 px-6 py-2 text-sm font-medium text-foreground/60 transition-all duration-200 hover:bg-accent hover:text-foreground">
              Cancel
            </DrawerClose>

            <button
              type="submit"
              disabled={creatingSize}
              form="create-size-form"
              className="rounded-md bg-primary/80 px-6 py-2 text-sm font-semibold text-foreground/80 transition-all duration-200 hover:bg-primary hover:text-foreground enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingSize ? "Creating..." : "Create Size"}
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

/* =========================================================
   Create Size Button
========================================================= */

const CreateSizeButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="flex flex-row items-center gap-x-1 rounded-lg bg-primary/80 p-2.5 text-sm font-medium text-nowrap transition-all duration-200 hover:-translate-y-1 hover:bg-primary sm:gap-x-2 sm:px-4 sm:py-1.5 sm:text-base"
    >
      <Plus className="size-6 sm:size-5" />

      <span className="hidden sm:inline">Create Size</span>
    </button>
  );
});

/* =========================================================
   Create Size Form
========================================================= */

export const CreateSizeForm = ({
  onSubmit,
  loading = false,
  onLoadingChange,
}: CreateSizeFormProps) => {
  const { createSize } = useSizeStore();

  const form = useForm<CreateSizeFormInput, unknown, CreateSizeFormValues>({
    resolver: zodResolver(createSizeSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "alpha",
      measurements: {},
      unit: undefined,
      isActive: true,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const sizeType = watch("type");
  const unit = watch("unit");
  const isActive = watch("isActive");
  const measurements = watch("measurements");

  const hasMeasurements =
    measurements &&
    Object.values(measurements).some((value) => value !== undefined);

  const submitHandler = async (data: CreateSizeFormValues) => {
    onLoadingChange?.(true);

    try {
      await onSubmit?.(data);
      await createSize(data);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form
      id="create-size-form"
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 sm:space-y-5"
    >
      {/* =========================================================
          Basic Information
      ========================================================= */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground">
            Basic Information
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Define the name and identifier for this size.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Size Name
            </label>

            <div className="relative">
              <Shirt className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

              <input
                {...register("name")}
                placeholder="e.g. M, 32, 40 EU"
                className={inputClass(errors.name)}
              />
            </div>

            <ErrorMessage message={errors.name?.message} />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug</label>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

              <input
                {...register("slug")}
                placeholder="e.g. m, 32, 40-eu"
                className={inputClass(errors.slug)}
              />
            </div>

            <ErrorMessage message={errors.slug?.message} />
          </div>
        </div>
      </div>

      {/* =========================================================
          Size Type
      ========================================================= */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground">
            Size Type
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Choose how this size is represented.
          </p>
        </div>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 sm:grid-cols-4">
              <TypeButton
                active={field.value === "alpha"}
                onClick={() => field.onChange("alpha")}
                icon={<Shirt className="size-4" />}
              >
                Alpha
              </TypeButton>

              <TypeButton
                active={field.value === "numeric"}
                onClick={() => field.onChange("numeric")}
                icon={<Hash className="size-4" />}
              >
                Numeric
              </TypeButton>

              <TypeButton
                active={field.value === "shoe"}
                onClick={() => field.onChange("shoe")}
                icon={<Footprints className="size-4" />}
              >
                Shoe
              </TypeButton>

              <TypeButton
                active={field.value === "custom"}
                onClick={() => field.onChange("custom")}
                icon={<Settings2 className="size-4" />}
              >
                Custom
              </TypeButton>
            </div>
          )}
        />

        <ErrorMessage message={errors.type?.message} />
      </div>

      {/* =========================================================
          Measurements
      ========================================================= */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground">
            Measurements
            {sizeType !== "custom" && (
              <span className="ml-2 text-xs font-normal text-zinc-500">
                Optional
              </span>
            )}
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Add measurements when this size requires physical dimensions.
          </p>
        </div>

        {/* Unit */}
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
              <TypeButton
                active={field.value === "cm"}
                onClick={() => field.onChange("cm")}
              >
                Centimeters (cm)
              </TypeButton>

              <TypeButton
                active={field.value === "inch"}
                onClick={() => field.onChange("inch")}
              >
                Inches (in)
              </TypeButton>
            </div>
          )}
        />

        <ErrorMessage message={errors.unit?.message} />

        {/* Measurement fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <MeasurementInput
            label="Chest"
            name="measurements.chest"
            register={register}
            error={errors.measurements?.chest}
            placeholder="e.g. 96"
          />

          <MeasurementInput
            label="Waist"
            name="measurements.waist"
            register={register}
            error={errors.measurements?.waist}
            placeholder="e.g. 80"
          />

          <MeasurementInput
            label="Length"
            name="measurements.length"
            register={register}
            error={errors.measurements?.length}
            placeholder="e.g. 70"
          />

          <MeasurementInput
            label="Height"
            name="measurements.height"
            register={register}
            error={errors.measurements?.height}
            placeholder="e.g. 180"
          />

          <MeasurementInput
            label="Width"
            name="measurements.width"
            register={register}
            error={errors.measurements?.width}
            placeholder="e.g. 40"
          />

          <MeasurementInput
            label="Depth"
            name="measurements.depth"
            register={register}
            error={errors.measurements?.depth}
            placeholder="e.g. 20"
          />
        </div>

        {errors.measurements?.message && (
          <ErrorMessage message={errors.measurements.message} />
        )}

        {hasMeasurements && !unit && (
          <p className="text-xs text-zinc-500">
            Select a measurement unit above.
          </p>
        )}
      </div>

      {/* =========================================================
          Status
      ========================================================= */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-2.5 py-4 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800">
            <ToggleLeft className="size-4 text-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-white">Size Status</p>

            <p className="mt-1 text-xs text-zinc-500">
              Inactive sizes won't be available for products.
            </p>
          </div>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={(checked) => {
            setValue("isActive", checked, {
              shouldValidate: true,
            });
          }}
        />
      </div>
    </form>
  );
};

/* =========================================================
   Measurement Input
========================================================= */

interface MeasurementInputProps {
  label: string;
  name:
    | "measurements.chest"
    | "measurements.waist"
    | "measurements.length"
    | "measurements.height"
    | "measurements.width"
    | "measurements.depth";
  register: ReturnType<typeof useForm<CreateSizeFormInput>>["register"];
  error?: unknown;
  placeholder?: string;
}

function MeasurementInput({
  label,
  name,
  register,
  error,
  placeholder,
}: MeasurementInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="relative">
        <Ruler className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

        <input
          type="number"
          min="0"
          step="0.01"
          {...register(name, {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          placeholder={placeholder}
          className={inputClass(error)}
        />
      </div>

      <ErrorMessage message={(error as { message?: string })?.message} />
    </div>
  );
}

/* =========================================================
   Type Button
========================================================= */

interface TypeButtonProps {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function TypeButton({ active, onClick, icon, children }: TypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-[10px] font-medium text-nowrap transition sm:px-4 sm:text-sm ${
        active
          ? "bg-zinc-800 text-white shadow-sm"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* =========================================================
   Helpers
========================================================= */

function inputClass(error?: unknown) {
  return `w-full rounded-xl border bg-zinc-900/60 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 sm:py-3 ${
    error
      ? "border-red-500/50 focus:border-red-500"
      : "border-zinc-800 focus:border-zinc-600"
  }`;
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs text-destructive">{message}</p>;
}

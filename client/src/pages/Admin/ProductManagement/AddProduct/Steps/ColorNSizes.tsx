import z from "zod";
import { useFormContext } from "react-hook-form";

// Store
import useAttributeStore from "@/store/useAttributeStore";

// Lib
import { cn } from "@/lib/utils";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const colorsNSizeSchema = addProductSchema.pick({
  colors: true,
  sizes: true,
});

export type ColorsNSizeSchemaType = z.infer<typeof colorsNSizeSchema>;

interface ContainerProps {
  title: string;
  text: string;
  counter: number;
  children: React.ReactNode;
}

const Container = ({ title, text, counter, children }: ContainerProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between gap-x-1">
        <div>
          <p className="text-base text-foreground font-medium">{title}</p>

          <p className="text-xs text-foreground/60 line-clamp-2">{text}</p>
        </div>

        <div className="min-w-fit h-fit text-[10px] text-foreground/70 bg-accent rounded-xl px-3 py-1">
          <span>{counter}</span> selected
        </div>
      </div>

      {children}
    </div>
  );
};

const ColorsNSizes = () => {
  const { attributes } = useAttributeStore();

  const groupedSizes = attributes
    ? (() => {
        const grouped = Object.values(
          attributes.sizes.reduce(
            (acc, size) => {
              if (!acc[size.type]) {
                acc[size.type] = {
                  type: size.type,
                  sizes: [],
                };
              }

              acc[size.type].sizes.push({
                _id: size._id,
                name: size.name,
                slug: size.slug,
              });

              return acc;
            },
            {} as Record<
              string,
              {
                type: string;
                sizes: {
                  _id: string;
                  name: string;
                  slug: string;
                }[];
              }
            >,
          ),
        );

        const normal = grouped.filter((g) => g.type.toLowerCase() !== "custom");

        const custom = grouped.filter((g) => g.type.toLowerCase() === "custom");

        return [...normal, ...custom];
      })()
    : [];

  const form = useFormContext<ColorsNSizeSchemaType>();

  const selectedColors = form.watch("colors") || [];
  const selectedSizes = form.watch("sizes") || [];

  const toggleColor = (colorId: string) => {
    const current = form.getValues("colors") || [];

    const exists = current.includes(colorId);

    form.setValue(
      "colors",
      exists ? current.filter((id) => id !== colorId) : [...current, colorId],
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const toggleSize = (sizeId: string) => {
    const current = form.getValues("sizes") || [];

    const exists = current.includes(sizeId);

    form.setValue(
      "sizes",
      exists ? current.filter((id) => id !== sizeId) : [...current, sizeId],
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="space-y-5">
      {/* Colors */}
      <Container
        title="Colors"
        text="Pulled from your global color library. Tap to include in this product."
        counter={selectedColors.length}
      >
        <div className="w-full grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {attributes &&
            attributes.colors.map((color) => {
              const isSelected = selectedColors.includes(color._id);

              return (
                <div
                  key={color._id}
                  onClick={() => toggleColor(color._id)}
                  className={cn(
                    "w-full rounded-lg flex items-center gap-x-2 p-3 py-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 border"
                      : "border-border hover:border-foreground/40 hover:bg-accent/60 border",
                  )}
                >
                  <span
                    className="size-5 sm:size-6 group-hover:scale-110 rounded-full ring-2 ring-accent transition-all duration-150"
                    style={{
                      backgroundColor: color.hexCode,
                    }}
                  ></span>

                  <div>
                    <p className="text-foreground text-xs sm:text-sm font-medium line-clamp-1">
                      {color.name}
                    </p>

                    <p className="text-foreground/60 text-[10px]">
                      {color.hexCode}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>

      {/* Sizes */}
      <Container
        title="Sizes"
        text="Mix size systems freely — alpha, numeric, footwear or custom."
        counter={selectedSizes.length}
      >
        <div className="flex flex-col gap-y-3">
          {groupedSizes.length > 0 &&
            groupedSizes.map((group) => {
              return (
                <div key={group.type} className="flex flex-col gap-y-2">
                  <p className="text-xs text-foreground/75 font-medium">
                    {group.type.toUpperCase()}
                  </p>

                  <div className="flex flex-row flex-wrap gap-2">
                    {group.sizes.map((size) => {
                      const isSelected = selectedSizes.includes(size._id);

                      return (
                        <div
                          key={size._id}
                          onClick={() => toggleSize(size._id)}
                          className={cn(
                            "min-w-fit rounded-lg px-4 py-1.5 cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary/10 border"
                              : "bg-accent border border-transparent hover:border-border",
                          )}
                        >
                          <span className="text-foreground/75 font-medium">
                            {size.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </div>
  );
};

export default ColorsNSizes;

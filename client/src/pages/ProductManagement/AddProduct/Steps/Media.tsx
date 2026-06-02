import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Utils
import { formatFileSize } from "@/utils/SizeManager";

// Icons
import { CloudUpload, Trash2 } from "lucide-react";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// ✅ Infer only the fields we need
export const mediaSchema = addProductSchema.pick({
  images: true,
  thumbnail: true,
});

export type MediaSchemaType = z.infer<typeof mediaSchema>;

const MAX_KB = 400;
const MAX_BYTES = MAX_KB * 1024;

const Media = () => {
  const form = useFormContext<MediaSchemaType>();

  const images = useWatch({
    control: form.control,
    name: "images",
  });

  const { firstErrorPath } = useFirstStepError<MediaSchemaType>();

  const removeImg = (indexToRemove: number) => {
    const currentImages = form.getValues("images") || [];

    const updatedImages = currentImages.filter(
      (_, index) => index !== indexToRemove,
    );

    form.setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-y-5">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <label
                htmlFor="productImagesUploader"
                className="group border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-accent/40 transition-all duration-300 flex flex-col justify-center items-center gap-y-3 py-7 "
              >
                <input
                  type="file"
                  id="productImagesUploader"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);

                    const imageFiles = files.filter((file) =>
                      file.type.startsWith("image/"),
                    );

                    field.onChange([...(field.value || []), ...imageFiles]);
                  }}
                  className="sr-only"
                />

                <CloudUpload className="size-14 rounded-full bg-primary p-4 group-hover:scale-105" />

                <p className="font-medium">Drop product images here</p>

                <p className="text-sm text-foreground/60">
                  PNG, JPG or WEBP — up to 10MB each. Recommended 2000×2000.
                </p>
              </label>

              {firstErrorPath === "name" && <FormMessage />}
            </FormItem>
          )}
        />

        {Array.isArray(images) && images.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold">Gallery</h3>
                <p className="text-xs text-muted-foreground">
                  Drag to reorder. Crown icon marks the thumbnail.
                </p>
              </div>

              <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                {images.length} image{images.length !== 1 && "s"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div className="flex flex-col gap-y-1">
                  <div className="bg-accent/50 border hover:border-foreground/30 rounded-2xl aspect-square overflow-hidden transition-all duration-200 group relative">
                    <img
                      key={`${image.name}-${image.lastModified}`}
                      src={URL.createObjectURL(image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* {!m.isThumbnail && (
                    <button
                      type="button"
                      onClick={() => setThumb(m.id)}
                      className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-white/20"
                    >
                      <Crown className="h-3 w-3" /> Set thumb
                    </button>
                  )} */}

                      <button
                        type="button"
                        onClick={() => removeImg(index)}
                        className="ml-auto rounded-lg bg-destructive/80 p-1.5 text-foreground backdrop-blur hover:bg-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="">
                    <p
                      className={`text-sm font-normal ${image.size >= MAX_BYTES ? "text-red-600" : "text-success"}`}
                    >
                      Size :{" "}
                      <span className="font-medium">
                        {formatFileSize(image.size)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};

export default Media;

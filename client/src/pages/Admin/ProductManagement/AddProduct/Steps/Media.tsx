import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Utils
import { formatFileSize } from "@/utils/SizeManager";

// Lib
import { cn } from "@/lib/utils";

// Icons
import { CloudUpload, Crown, Trash2 } from "lucide-react";

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

  const thumbnail = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  const { firstErrorPath } = useFirstStepError<MediaSchemaType>();

  const setThumb = (uuid: string) => {
    form.setValue("thumbnail", uuid);
  };

  const removeImg = (uuid: string) => {
    const isThumb = uuid === thumbnail;

    const currentImages = form.getValues("images") || [];

    const updatedImages = currentImages.filter((file) => file.id !== uuid);

    form.setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (isThumb) {
      form.setValue("thumbnail", undefined);
    }
  };

  useEffect(() => {
    if (!images?.length) {
      form.setValue("thumbnail", undefined);
      return;
    }

    const exists = images.some((img) => img.id === thumbnail);

    if (!thumbnail || !exists) {
      form.setValue("thumbnail", images[0].id);
    }
  }, [images, thumbnail]);

  // useEffect(() => {
  //   const urls =
  //     images?.map((img) => ({
  //       id: img.id,
  //       url: URL.createObjectURL(img.file),
  //     })) || [];

  //   setPreviewUrls(urls);

  //   return () => {
  //     urls.forEach((u) => URL.revokeObjectURL(u.url));
  //   };
  // }, [images]);

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
                className="group border-2 border-dashed border-border rounded-2xl hover:border-primary/60 hover:bg-accent/40 transition-all duration-300 flex flex-col justify-center items-center gap-y-3 py-7"
              >
                <input
                  type="file"
                  id="productImagesUploader"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);

                    const imageFiles = Array.from(files).map((file) => ({
                      id: crypto.randomUUID(),
                      file,
                    }));

                    field.onChange([...(field.value || []), ...imageFiles]);
                  }}
                  className="sr-only"
                />

                <CloudUpload className="size-14 rounded-full bg-primary p-4 group-hover:scale-105" />

                <p className="font-medium text-center">
                  Drop product images here
                </p>

                <p className="text-sm text-foreground/60 text-center">
                  PNG, JPG or WEBP — up to 10MB each. Recommended 2000×2000.
                </p>
              </label>

              {firstErrorPath === "images" && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Previews */}
        {Array.isArray(images) && images.length > 0 && (
          <div>
            {/* Title & Description */}
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold">Gallery</h3>
                <p className="text-xs text-muted-foreground">
                  Crown icon marks the thumbnail.
                </p>
              </div>

              <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                {images.length} image{images.length !== 1 && "s"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image) => {
                const isThumb = image.id === thumbnail;

                return (
                  <div key={image.id} className="flex flex-col gap-y-1">
                    {/* Image Layer */}
                    <div
                      className={cn(
                        "bg-accent/50 border shadow  rounded-2xl aspect-square overflow-hidden transition-all duration-200 group relative",
                        isThumb
                          ? "border-primary/60 shadow-primary/40"
                          : "hover:border-foreground/40 hover:shadow-foreground/40",
                      )}
                    >
                      {/* Hover Layer */}
                      <div className="absolute size-full bg-linear-to-b from-transparent to-background opacity-0 group-hover:opacity-100" />

                      {/* Image */}
                      <img
                        key={image.id}
                        src={URL.createObjectURL(image.file)}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {/* Thumbnail Badge */}
                      {isThumb && (
                        <div className="absolute w-fit inset-x-2 text-[10px] font-semibold bg-primary-gradient rounded-xl top-2 flex flex-row items-center gap-1 px-1.5 py-0.5">
                          <Crown className="h-3 w-3" />
                          <span>Thumbnail</span>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0">
                        {/* Set Thumbnail Button */}
                        {!isThumb && (
                          <button
                            type="button"
                            onClick={() => setThumb(image.id)}
                            className="flex items-center gap-1 rounded-lg bg-foreground/10 px-2 py-1 text-[11px] font-medium text-foreground backdrop-blur hover:bg-foreground/20"
                          >
                            <Crown className="h-3 w-3" />

                            <span>Set thumb</span>
                          </button>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImg(image.id)}
                          className="ml-auto rounded-lg bg-destructive md:bg-destructive/80 p-1.5 text-foreground backdrop-blur hover:bg-destructive "
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* File Size */}
                    <div>
                      <p
                        className={`text-sm font-normal ${image.file.size >= MAX_BYTES ? "text-destructive" : "text-success"}`}
                      >
                        Size :{" "}
                        <span className="font-medium">
                          {formatFileSize(image.file.size)}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};

export default Media;

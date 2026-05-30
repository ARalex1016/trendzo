import { useFormContext } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Icons
import { CloudUpload } from "lucide-react";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// ✅ Infer only the fields we need
export const mediaSchema = addProductSchema.pick({
  images: true,
  thumbnail: true,
});

export type MediaSchemaType = z.infer<typeof mediaSchema>;

const Media = () => {
  const form = useFormContext<MediaSchemaType>();

  const { firstErrorPath } = useFirstStepError<MediaSchemaType>();

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-y-5">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <div className="border border-dashed border-border rounded-2xl hover:border-primary flex flex-col items-center gap-y-2 p-5">
                <CloudUpload
                  // size={40}
                  className="size-14 rounded-full bg-primary p-4 focus:scale-110"
                />

                <p className="font-medium">Drop product images here</p>

                <p className="text-sm text-foreground/60">
                  PNG, JPG or WEBP — up to 10MB each. Recommended 2000×2000.
                </p>
              </div>

              {firstErrorPath === "name" && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Media;

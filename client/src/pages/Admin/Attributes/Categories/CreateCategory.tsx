import { useState, forwardRef } from "react";

// Components
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

// Icons
import { Plus } from "lucide-react";

export const CreateCategory = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [creatingCoupon, setCreatingCoupon] = useState<boolean>(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={false}
      swipeDirection="right"
    >
      {/* <DrawerTrigger asChild> */}
      <CreateCategoryButton onClick={() => setOpen(true)} />
      {/* </DrawerTrigger> */}

      <DrawerContent className="bg-card flex h-full max-h-screen flex-col">
        {/* Header */}
        <DrawerHeader className="shrink-0 bg-accent/80 px-6 py-3">
          <DrawerTitle className="text-foreground font-medium">
            Create Category
          </DrawerTitle>

          <DrawerDescription className="text-foreground/60 text-sm">
            Add a new product category.
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Scrollable middle */}
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <div className="px-6 py-3">
            {/* <CreateCouponForm
              onClose={() => setOpen(false)}
              loading={creatingCoupon}
              onLoadingChange={setCreatingCoupon}
            /> */}
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
              Create Category
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const CreateCategoryButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="text-sm sm:text-base text-nowrap font-medium bg-primary/80 rounded-lg flex flex-row items-center gap-x-1 sm:gap-x-2 p-2.5 sm:px-4 sm:py-1.5 hover:bg-primary hover:-translate-y-0.5 transition-all duration-200"
    >
      <Plus className="size-6 sm:size-5" />

      <span className="hidden sm:inline">Create Category</span>
    </button>
  );
});

// Components
import FilterSidebar from "./FilterSidebar";
import ProductDisplay from "./ProductDisplay";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Store
import { useIsMobile } from "@/hooks/use-mobile";

// Icons
import { SlidersHorizontal, X } from "lucide-react";

const Products = () => {
  const isMobile = useIsMobile();

  return (
    <section className="w-full min-h-svh flex flex-row gap-x-8 px-side-spacing relative">
      {/* Filter for Desktop */}
      {!isMobile && <FilterSidebar />}

      {/* Filter for Small Devices (Mobile) */}
      {isMobile && (
        <Drawer direction="left">
          <DrawerTrigger className="bg-sidebar-primary p-2 rounded-full shadow-xs shadow-foreground/60 fixed bottom-side-spacing right-side-spacing z-20 hover:bg-sidebar-primary/70 hover:scale-105">
            <SlidersHorizontal />
          </DrawerTrigger>

          <DrawerContent className="w-fit! px-0">
            <DrawerClose
              aria-label="Close filter"
              className="rounded-md p-1 hover:bg-muted absolute top-4 right-5"
            >
              <X className="h-5 w-5" />
            </DrawerClose>

            <DrawerTitle className="invisible">Filter</DrawerTitle>

            <DrawerDescription className="invisible">Filter</DrawerDescription>

            <FilterSidebar />
          </DrawerContent>
        </Drawer>
      )}

      <ProductDisplay />
    </section>
  );
};

export default Products;

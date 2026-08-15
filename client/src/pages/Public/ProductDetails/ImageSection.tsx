import { useEffect, useState } from "react";

// Components
import ImageWithLens from "@/components/ImageWithLens";

// Lib
import { cn } from "@/lib/utils";

// Types
import type { IImage } from "@/types/product.type";

interface ImageSection {
  images: IImage[];
}

const ImageSection = ({ images }: ImageSection) => {
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);

  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  return (
    <div className="w-full flex flex-col gap-x-4 gap-y-6">
      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden">
        <ImageWithLens
          src={selectedImage?.url}
          alt="Selected Image"
          className="w-full aspect-11/12"
        />
      </div>

      {/* Image Group */}
      <div className="flex flex-row gap-x-3 gap-y-4 rounded-lg overflow-x-auto no-scrollbar">
        {images.length >= 1 &&
          images.map((image, index) => {
            const activeImage = image?.publicId === selectedImage?.publicId;

            return (
              <img
                key={image.publicId ?? index}
                src={image.url}
                alt={`Image${index}`}
                // loading="lazy"
                onClick={() => setSelectedImage(image)}
                className={cn(
                  "size-16 md:size-20 aspect-square bg-foreground rounded-lg object-cover transition-all duration-150",
                  activeImage ? "scale-110 shadow shadow-primary" : "",
                )}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ImageSection;

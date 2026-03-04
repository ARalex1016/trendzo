import { useState } from "react";

// Components
import ImageWithLens from "@/components/ImageWithLens";

interface ImageSection {
  images: string[];
}

const ImageSection = ({ images }: ImageSection) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(() => {
    if (images.length > 0) {
      return images[0];
    } else {
      return null;
    }
  });

  return (
    <div className="w-full flex flex-col gap-x-4 gap-y-6">
      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden">
        <ImageWithLens
          src={selectedImage ? selectedImage : ""}
          alt="Selected Image"
          className="w-full aspect-11/12"
        />
      </div>

      {/* Image Group */}
      <div className="flex flex-row gap-x-2 gap-y-4 rounded-lg overflow-x-auto no-scrollbar">
        {images.map((img, i) => {
          const activeImage = img === selectedImage;

          return (
            <img
              key={img}
              src={img}
              alt={`Image${i}`}
              onClick={() => setSelectedImage(img)}
              className={`size-16 md:size-20 aspect-square bg-foreground rounded-lg object-cover transition-all duration-200 ${activeImage && "scale-110"}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageSection;

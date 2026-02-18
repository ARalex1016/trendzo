import { useState } from "react";

// Components
import { Lens } from "@/components/ui/lens";

interface ImageWithLensProps {
  src: string;
}

const ImageWithLens = ({ src }: ImageWithLensProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <Lens hovering={hovering} setHovering={setHovering}>
      <img
        src={src}
        alt="Image"
        width={500}
        height={500}
        className="rounded-2xl"
      />
    </Lens>
  );
};

export default ImageWithLens;

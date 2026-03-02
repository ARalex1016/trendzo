import * as React from "react";

// Components
import { Lens } from "@/components/ui/lens";

const ImageWithLens = ({ src, className }: React.ComponentProps<"img">) => {
  const [hovering, setHovering] = React.useState(false);

  return (
    <Lens hovering={hovering} setHovering={setHovering}>
      <img src={src} className={`${className}`} />
    </Lens>
  );
};

export default ImageWithLens;

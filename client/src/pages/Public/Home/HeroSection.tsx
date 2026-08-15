// Components
import { Button } from "@/components/ui/button";

// Images
// import HeroImage from "@/assets/Images/hero-image.png";

const HeroSection = () => {
  return (
    <section
      className="w-full bg-card flex flex-col sm:flex-row gap-x-4"
      style={{
        height: "calc(100svh - var(--menu-height))",
      }}
    >
      {/* Right -> Description with Buttons */}
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full flex flex-col justify-center gap-y-4 sm:gap-y-6 order-2 sm:order-1 px-side-spacing">
        {/* Title */}
        <h1 className="text-xl sm:text-6xl text-foreground font-semibold leading-[1.15]">
          Fashion Delivered Across Nepal
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-foreground/60 font-medium">
          Clothes, bags, shoes & more — shop premium quality with fast delivery.
        </p>

        {/* Action Buton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="px-8 py-5 sm:py-6">Shop Now</Button>

          <Button
            variant="outline"
            className="px-8 py-5 sm:py-6 text-primary bg-transparent! border-2 border-primary! hover:bg-primary!"
          >
            View Deals
          </Button>
        </div>
      </div>

      {/* Left -> Image */}
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full order-1 sm:order-2">
        <img
          src="https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd29tYW4lMjBlbGVnYW50fGVufDF8fHx8MTc2MzcxNTczN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          // src={HeroImage}
          alt="Fashion model"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;

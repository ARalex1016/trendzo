import { useNavigate } from "react-router-dom";

// Types
import type { ICategory } from "@/types/category.type";

// Utils
import { capitalize } from "@/utils/StringManager";

interface CardProps {
  className?: string;
  data: ICategory;
}

const CategoryCard = ({ data, className }: CardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate("/products", {
          state: {
            category: {
              name: data.name,
              id: data._id,
            },
          },
        })
      }
      className={`min-w-28 max-w-80 aspect-3/4 rounded-xl overflow-hidden relative group shadow-md hover:shadow-xl ${className}`}
    >
      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2Mzc4MTYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt={`${data.metaTitle} Image`}
        className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Layer */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className="text-white text-lg xs:text-xl sm:text-2xl font-bold">
          {capitalize(data.name)}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;

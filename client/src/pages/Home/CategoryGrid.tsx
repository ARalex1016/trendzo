// Components
import CategoryCard from "@/components/Cards/CategoryCard";

// Store
import useAttributeStore from "@/store/useAttributeStore";

const CategoryGrid = () => {
  const { attributes } = useAttributeStore();

  return (
    <section className="w-full min-h-svh bg-background flex flex-col justify-center gap-y-10 px-side-spacing py-10">
      {/* Title */}
      <div className="flex flex-col items-center gap-y-4 sm:gap-y-5">
        <h2 className="text-2xl sm:text-4xl font-bold">Shop By Category</h2>

        <p className="max-w-5/5 sm:max-w-3/5 text-foreground/60 text-center">
          Discover your style across our curated collections
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {attributes?.categories?.data?.map((category) => {
          return <CategoryCard key={category._id} data={category} />;
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;

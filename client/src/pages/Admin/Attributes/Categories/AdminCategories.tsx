// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import { CreateCategory } from "./CreateCategory";
import CategoryStats from "./CategoryStats";
import CategoryHistory from "./CategoryHistory/CategoryHistory";

const AdminCategories = () => {
  return (
    <PageShell>
      <div className="flex flex-row justify-between items-start">
        <TitleTextContainer title="Categories">
          Create and manage product categories.
        </TitleTextContainer>

        <CreateCategory />
      </div>

      <CategoryStats />

      <CategoryHistory />
    </PageShell>
  );
};

export default AdminCategories;

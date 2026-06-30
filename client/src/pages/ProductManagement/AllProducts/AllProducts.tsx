// Components
import { PageShell, TitleTextContainer } from "@/components/Container";
import Stats from "./Stats";

const AllProducts = () => {
  return (
    <PageShell>
      <TitleTextContainer title="Product Catalog">
        Manage your luxury fashion inventory
      </TitleTextContainer>

      <Stats />
    </PageShell>
  );
};

export default AllProducts;

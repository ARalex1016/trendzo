// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import SizeStats from "./SizeStats";
import SizeHistory from "./SizeHistory";
import { CreateSize } from "./CreateSize";

const CouponsManagement = () => {
  return (
    <PageShell>
      <div className="flex flex-row justify-between items-start">
        <TitleTextContainer title="Size Management">
          Create, organize, and manage product sizes and measurements.
        </TitleTextContainer>

        <CreateSize />
      </div>

      <SizeStats />

      <SizeHistory />
    </PageShell>
  );
};

export default CouponsManagement;

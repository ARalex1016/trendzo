// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Types
import type { IProduct } from "@/types/product.type";

interface DSR_TabSectionProps {
  description: string;
  specifications: IProduct["specifications"];
}

interface ContainerProps {
  title?: string;
  children?: React.ReactNode;
}

interface TableProps {
  label: string;
  value: string | number | null;
}

const Container = ({ title, children }: ContainerProps) => {
  return (
    <div className="bg-background1 border border-border rounded-xl p-5">
      {title && <p className="text-lg font-medium mb-2">{title}</p>}

      {children}
    </div>
  );
};

const Table = ({ label, value }: TableProps) => {
  if (!value) return;

  return (
    <>
      <div className="w-full flex flex-row justify-between mt-5 mb-2">
        <p className="text-foreground/60 font-medium">{label}</p>

        <p>{value}</p>
      </div>

      <Separator />
    </>
  );
};

const DSR_TabSection = ({
  description,
  specifications,
}: DSR_TabSectionProps) => {
  return (
    <Tabs defaultValue="description">
      <TabsList variant="line" className="pb-0!">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specification">Specification</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      {/* Description */}
      <TabsContent value="description">
        <Container title="Product Description">
          <p className="text-sm text-foreground/60 font-medium">
            {description}
          </p>
        </Container>
      </TabsContent>

      {/* Specification */}
      <TabsContent value="specification">
        <Container title="Specification">
          <Table label="Material" value={specifications.material || null} />

          <Table label="Weight" value={specifications.weight || null} />

          <Table
            label="Country of Origin"
            value={specifications.countryOfOrigin || null}
          />

          <Table label="Warranty" value={specifications.warranty || null} />
        </Container>
      </TabsContent>

      {/* Reviews */}
      <TabsContent value="reviews">
        <Container title="Reviews"></Container>
      </TabsContent>
    </Tabs>
  );
};

export default DSR_TabSection;

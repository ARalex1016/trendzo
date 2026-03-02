// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const DSR_Tab = () => {
  return (
    <Tabs defaultValue="description">
      <TabsList variant="line" className="pb-0!">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specification">Specification</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <Separator />

      <TabsContent value="description">Desc</TabsContent>
      <TabsContent value="specification">Spec</TabsContent>
      <TabsContent value="reviews">Revi</TabsContent>
    </Tabs>
  );
};

export default DSR_Tab;

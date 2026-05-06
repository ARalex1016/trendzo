// Components
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const OrderCard = () => {
  return (
    <div className="border border-border rounded-2xl px-3 py-4">
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row justify-between">
          <p className="text-primary font-medium">Order Number</p>

          <p className="inline-block bg-blue-500/20 border border-blue-500/80 rounded-2xl shadow shadow-blue-500/40 px-3 py-1">
            Confirmed
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <p className="text-muted-foreground font-medium">Order Date</p>

          <p className="inline-block bg-green-500/20 border border-green-500/80 rounded-2xl shadow shadow-green-500/40 px-3 py-1">
            Paid
          </p>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Action Buttons */}
      <Button>View Details</Button>
    </div>
  );
};

export default OrderCard;

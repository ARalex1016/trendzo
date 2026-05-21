// Components
import { PageShell } from "@/components/Container";

const MyOrderDetails = () => {
  return (
    <PageShell back="Back to My Orders" to="/myorders">
      <div className="bg-background1 rounded-xl border border-border p-4">
        <p className="text-lg font-medium">ORD-2026-4995</p>
      </div>
    </PageShell>
  );
};

export default MyOrderDetails;

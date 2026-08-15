// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";

const Withdraw = () => {
  return (
    <PageShell back="Back to Wallet" to="/wallet">
      <TitleTextContainer title="Withdraw Money">
        Withdraw your available earnings securely.
      </TitleTextContainer>
    </PageShell>
  );
};

export default Withdraw;

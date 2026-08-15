import { useEffect } from "react";

// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import AvailableBalance from "./AvailableBalance";
import StatsContainer from "./StatsContainer";
import Earnings from "./Earnings";
import RecentTransactions from "./RecentTransactions";

// Store
import useWalletStore from "@/store/useWalletStore";

const Wallet = () => {
  const { getMyLedger } = useWalletStore();

  useEffect(() => {
    getMyLedger();
  }, []);

  return (
    <PageShell className="space-y-6 sm:space-y-7">
      <TitleTextContainer title="My Wallet">
        Manage your earnings, balance and transactions.
      </TitleTextContainer>

      <AvailableBalance />

      <StatsContainer />

      <Earnings />

      <RecentTransactions />
    </PageShell>
  );
};

export default Wallet;

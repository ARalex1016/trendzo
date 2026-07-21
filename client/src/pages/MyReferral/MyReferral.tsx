// Components
import { PageShell } from "@/components/Container";
import { Title, BaseText } from "@/components/Text";
import { CopyButton } from "@/components/CopyButton";

// Store
import useAuthStore from "@/store/useAuthStore";

const MyReferral = () => {
  const { user } = useAuthStore();

  console.log(user);

  let url = window.location.origin;

  let refId = user?.referralId;

  let refLink = `${url}?ref=${refId}`;

  console.log(refLink);

  return (
    <PageShell>
      <Title text="Invite Friends & Earn Rewards" />

      <BaseText>
        Share your referral link. When someone registers through your link and
        purchases products worth more than NPR 1000, you earn NPR 50.
      </BaseText>

      <div className="w-fit bg-accent rounded-lg flex flex-row gap-x-3 px-5 py-3 mx-auto my-3">
        <span className="select-none line-clamp-1">{refLink}</span>
        <CopyButton value={refLink} />
      </div>
    </PageShell>
  );
};

export default MyReferral;

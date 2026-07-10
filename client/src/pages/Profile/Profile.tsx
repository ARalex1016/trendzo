// Components
import { PageShell, TitleTextContainer } from "@/components/Container";
import { PersonalInformation } from "./PersonalInformation";
import SavedAddresses from "./SavedAddresses";

const Profile = () => {
  return (
    <PageShell className="flex flex-col gap-y-5 relative">
      <TitleTextContainer title="My Profile">
        Manage your personal information, saved addresses, and account security.
      </TitleTextContainer>

      <PersonalInformation />

      <SavedAddresses />
    </PageShell>
  );
};

export default Profile;

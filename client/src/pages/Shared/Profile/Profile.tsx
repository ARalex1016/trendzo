// Components
import { PageShell, TitleTextContainer } from "@/components/Container";
import { PersonalInformation } from "./PersonalInformation";
import SavedAddresses from "./SavedAddresses";
import LogoutCard from "./LogoutCard";

const Profile = () => {
  return (
    <PageShell className="max-w-xl mx-auto flex flex-col gap-y-5 relative">
      <TitleTextContainer title="My Profile">
        Manage your personal information, saved addresses, and account security.
      </TitleTextContainer>

      <PersonalInformation />

      <SavedAddresses />

      <LogoutCard />
    </PageShell>
  );
};

export default Profile;

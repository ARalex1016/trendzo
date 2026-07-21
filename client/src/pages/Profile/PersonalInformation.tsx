// Components
import { Container, InputField } from "./PageComponents";
import { VerificationBanner } from "./Verification/VerificationBanner";

// import VerificationDialog from "./Verification/VerificationDialog";

// Lib
import { cn } from "@/lib/utils";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { User, Dot, Mail, Phone } from "lucide-react";

export const PersonalInformation = () => {
  const { user, sendEmailOtp } = useAuthStore();

  return (
    <Container
      title={"Personal Information"}
      text={"Your name, contact details, and account status"}
      icon={User}
    >
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4 sm:px-6">
        <InputField
          label={"Full Name"}
          icon={User}
          value={user?.name}
          readOnly
        />

        <InputField
          label={"Account Status"}
          className={cn(user?.verified ? "text-success" : "text-destructive")}
          icon={Dot}
          iconClassName={cn(
            "scale-200",
            user?.verified ? "text-success" : "text-destructive",
          )}
          value={user?.verified ? "Verified" : "Not Verified"}
          readOnly
        />

        <InputField
          label={"Email"}
          icon={Mail}
          value={user?.email}
          readOnly
          isVerified={user?.isEmailVerified}
        />

        <InputField
          label={"Phone"}
          icon={Phone}
          value={user?.phone}
          readOnly
          isVerified={user?.isPhoneVerified}
        />
      </div>

      {/* Verification Action Section */}
      <div className="space-y-4 px-4 sm:px-6">
        {!user?.isEmailVerified && (
          <VerificationBanner
            text="Your email is not verified."
            buttonText="Verify Email"
            onClick={sendEmailOtp}
            veriFicationType="email"
          />
        )}

        {!user?.isPhoneVerified && (
          <VerificationBanner
            text="Your phone number is not verified."
            buttonText="Verify Phone"
            veriFicationType="phone"
          />
        )}
      </div>

      {/* <VerificationDialog
        open={true}
        onOpenChange={() => true}
        veriFicationType="email"
      /> */}
    </Container>
  );
};

// Components
import { Container } from "./PageComponents";
import SavedAddressCard from "./Address/SavedAddressCard";
import NewAddress from "./Address/NewAddress";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { MapPin } from "lucide-react";

const SavedAddresses = () => {
  const { user } = useAuthStore();

  return (
    <Container
      title="Saved Addresses"
      text="Manage delivery addresses used during checkout"
      icon={MapPin}
      iconColor={"primary2"}
      actionText={"+ Add New"}
    >
      <div className="space-y-3 px-6">
        {user &&
          user?.addresses.map((address) => {
            return <SavedAddressCard key={address._id} address={address} />;
          })}

        <NewAddress />
      </div>
    </Container>
  );
};

export default SavedAddresses;

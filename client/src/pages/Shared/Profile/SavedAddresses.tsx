import { useState } from "react";

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

  const [isOpenNewAddress, setIsOpenNewAddress] = useState<boolean>(false);

  const handleOpenNewAddress = () => {
    setIsOpenNewAddress(true);
  };

  const handleClose = () => {
    setIsOpenNewAddress(false);
  };

  return (
    <Container
      title="Saved Addresses"
      text="Manage delivery addresses used during checkout"
      icon={MapPin}
      iconColor={"primary2"}
      actionText={"+ Add New"}
      onActionButtonClick={handleOpenNewAddress}
    >
      <div className="space-y-4 px-4 sm:px-6">
        {user &&
          user?.addresses.map((address) => {
            return <SavedAddressCard key={address._id} address={address} />;
          })}

        <NewAddress open={isOpenNewAddress} onClose={handleClose} />
      </div>
    </Container>
  );
};

export default SavedAddresses;

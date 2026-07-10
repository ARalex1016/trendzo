// Components
import { Container } from "./PageComponents";

// Icons
import { MapPin } from "lucide-react";

const SavedAddresses = () => {
  return (
    <Container
      title="Saved Addresses"
      text="Manage delivery addresses used during checkout"
      icon={MapPin}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-6"></div>
    </Container>
  );
};

export default SavedAddresses;

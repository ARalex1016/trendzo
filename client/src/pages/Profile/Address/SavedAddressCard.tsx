// Store
import useUserStore from "@/store/useUserStore";

// Types
import { type IAddress } from "@/types/user.types";

// Icons
import { Trash2, Pencil } from "lucide-react";

interface SavedAddressCardProps {
  address: IAddress;
}

const DefaultBadge = () => {
  return (
    <p className="text-[10px] md:text-xs text-violet-600 font-medium bg-violet-600/5 border border-violet-600 rounded-lg px-2 py-0">
      DEFAULT
    </p>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="w-full flex flex-row items-center">
      <p className="w-[45%] text-[10px] md:text-xs font-medium text-foreground/40 text-nowrap">
        {label}
      </p>

      <p className="w-full text-xs md:text-sm font-medium text-foreground/60 text-wrap">
        {value}
      </p>
    </div>
  );
};

const SavedAddressCard = ({ address }: SavedAddressCardProps) => {
  const { removeAddress } = useUserStore();

  const handleRemoveAddress = async () => {
    try {
      await removeAddress(address._id);
    } catch (error) {}
  };

  return (
    <div className="bg-accent/60 border border-border rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-sm hover:shadow-primary/40 group">
      {/* Header */}
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-x-3">
            <p className="text-base md:text-lg font-medium text-foreground">
              {address.label}Home
            </p>

            {address.isDefault && <DefaultBadge />}
          </div>

          <p className="text-xs md:text-sm text-foreground/60">
            {address.fullName}
          </p>
        </div>

        {/* Action */}
        <div className="flex md:hidden group-hover:flex transition-all duration-300 flex-row items-center gap-x-4">
          {!address.isDefault && (
            <p className="text-xs md:text-sm font-medium text-foreground/60 text-nowrap">
              Set Default
            </p>
          )}

          <Pencil className="size-3.5 md:size-4 text-foreground/60" />

          <button onClick={handleRemoveAddress}>
            <Trash2 className="size-3.5 md:size-4 text-foreground/60" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-1">
        <InfoField label="Street" value={address.street} />
        <InfoField label="Area" value={address.area ?? ""} />
        <InfoField label="City" value={address.city} />
        <InfoField label="State" value={address.state ?? ""} />
        <InfoField label="Country" value={address.country ?? ""} />
        <InfoField label="Postal Code" value={address.postalCode ?? ""} />
        <InfoField label="Phone" value={address.phone ?? ""} />
        <InfoField label="Email" value={address.email ?? ""} />
        <InfoField label="Landmark" value={address.landmark ?? ""} />
      </div>
    </div>
  );
};

export default SavedAddressCard;

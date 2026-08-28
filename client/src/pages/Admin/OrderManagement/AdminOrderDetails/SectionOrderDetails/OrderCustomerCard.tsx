import {
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  BadgeCheck,
  Package,
} from "lucide-react";

// Types
import type { IOrderUser } from "@/types/order/order_response.type";

interface OrderCustomerCardProps {
  user?: IOrderUser | string;
}

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const VerificationBadge = ({
  verified,
  label,
}: {
  verified: boolean;
  label: string;
}) => {
  if (!verified) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
      <BadgeCheck className="h-3 w-3" />
      {label}
    </span>
  );
};

export function OrderCustomerCard({ user }: OrderCustomerCardProps) {
  // In some API responses the user may only be populated as an ObjectId.
  if (!user || typeof user === "string") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#161618] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06]">
            <UserRound className="h-5 w-5 text-white/40" />
          </div>

          <div>
            <p className="text-sm font-medium text-white/70">
              Customer information unavailable
            </p>
            <p className="mt-0.5 text-xs text-white/35">
              Customer details could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.name);

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[#161618] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        {/* <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06]">
          <UserRound className="h-5 w-5 text-white/40" />
        </div> */}

        <div>
          <h3 className="text-sm font-semibold text-white">Customer</h3>
          <p className="mt-1 text-xs text-white/40">Customer information</p>
        </div>

        {user.verified && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
      </div>

      {/* Customer identity */}
      <div className="flex items-center gap-3.5">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-sm font-semibold text-white/70 ring-1 ring-white/10">
            {initials || <UserRound className="h-5 w-5" />}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-white">
              {user.name}
            </h4>

            <span className="shrink-0 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium capitalize text-white/45">
              {user.role}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-white/40">
            Customer since{" "}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Contact information */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <Mail className="h-3.5 w-3.5 text-white/50" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Email
            </p>

            <div className="mt-0.5 flex min-w-0 items-center gap-2">
              <p className="truncate text-xs text-white/75">{user.email}</p>

              <VerificationBadge
                verified={user.isEmailVerified}
                label="Verified"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <Phone className="h-3.5 w-3.5 text-white/50" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Phone
            </p>

            <div className="mt-0.5 flex min-w-0 items-center gap-2">
              <p className="truncate text-xs text-white/75">
                {user.phone || "Not provided"}
              </p>

              <VerificationBadge
                verified={user.isPhoneVerified}
                label="Verified"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

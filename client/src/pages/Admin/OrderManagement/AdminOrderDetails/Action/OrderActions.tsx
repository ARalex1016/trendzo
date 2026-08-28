import { useState } from "react";

// Components
import { OrderActionButton } from "./OrderActionButton";
import { OrderActionDialog } from "./OrderActionDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { MoreHorizontal } from "lucide-react";

// Types
import type {
  OrderAction,
  OrderWithAction,
} from "@/types/order/order_response.type";

interface OrderActionsProps {
  order: OrderWithAction;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [selectedAction, setSelectedAction] = useState<OrderAction | null>(
    null,
  );

  if (!order.availableActions?.length) {
    return null;
  }

  const availableActions = order.availableActions ?? [];

  /*
   * Primary action:
   * The first available action that is considered operationally important.
   */
  const primaryAction =
    availableActions.find((action) =>
      ["verify_payment", "confirm", "ship", "deliver"].includes(action),
    ) ?? null;

  const secondaryActions = availableActions.filter(
    (action) => action !== primaryAction,
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Primary Action */}
        {primaryAction && (
          <OrderActionButton
            action={primaryAction}
            onClick={setSelectedAction}
            className="bg-foreground/70 text-background hover:bg-foreground transition-all duration-200"
          />
        )}

        {/* Secondary Actions */}
        {secondaryActions.length === 1 && (
          <div className="border border-border rounded-lg hover:bg-foreground/5 transition-all duration-200">
            <OrderActionButton
              action={secondaryActions[0]}
              onClick={setSelectedAction}
            />
          </div>
        )}

        {secondaryActions.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="
                  inline-flex h-9 items-center gap-2
                  rounded-lg border border-border
                  bg-foreground/5 px-3
                  text-sm font-medium
                  text-muted-foreground
                  transition-colors
                  hover:bg-foreground/10
                  hover:text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                "
              >
                <MoreHorizontal className="h-4 w-4" />

                <span>More</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-primary/10 backdrop-blur-2xl"
            >
              {secondaryActions.map((action) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className="cursor-pointer hover:bg-primary/15! transition-all duration-200"
                >
                  <OrderActionButton
                    action={action}
                    onClick={() => setSelectedAction(action)}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <OrderActionDialog
        open={selectedAction !== null}
        action={selectedAction}
        order={order}
        onClose={() => setSelectedAction(null)}
      />
    </>
  );
}

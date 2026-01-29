import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type OrderStatus = "requested" | "accepted" | "in_progress" | "completed" | "cancelled";

const statusMessages: Record<OrderStatus, string> = {
  requested: "Order placed successfully",
  accepted: "Your order has been accepted!",
  in_progress: "Your order is now in transit",
  completed: "Your order has been delivered!",
  cancelled: "Your order has been cancelled",
};

const tractorStatusMessages: Record<OrderStatus, string> = {
  requested: "Tractor booking submitted",
  accepted: "Tractor booking confirmed!",
  in_progress: "Tractor service in progress",
  completed: "Tractor service completed!",
  cancelled: "Tractor booking cancelled",
};

const laborStatusMessages: Record<OrderStatus, string> = {
  requested: "Labor booking submitted",
  accepted: "Labor booking confirmed!",
  in_progress: "Worker is on the job",
  completed: "Work completed successfully!",
  cancelled: "Labor booking cancelled",
};

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status as OrderStatus;
          const message = statusMessages[newStatus] || "Order status updated";
          
          toast.success(message, {
            description: `Order #${(payload.new.id as string).slice(0, 8)}...`,
            duration: 5000,
          });
          
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    // Subscribe to tractor bookings changes
    const tractorChannel = supabase
      .channel("tractor-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tractor_bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status as OrderStatus;
          const message = tractorStatusMessages[newStatus] || "Tractor booking updated";
          
          toast.success(message, {
            description: `Booking #${(payload.new.id as string).slice(0, 8)}...`,
            duration: 5000,
          });
          
          queryClient.invalidateQueries({ queryKey: ["tractor-bookings"] });
        }
      )
      .subscribe();

    // Subscribe to labor bookings changes
    const laborChannel = supabase
      .channel("labor-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "labor_bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status as OrderStatus;
          const message = laborStatusMessages[newStatus] || "Labor booking updated";
          
          toast.success(message, {
            description: `Booking #${(payload.new.id as string).slice(0, 8)}...`,
            duration: 5000,
          });
          
          queryClient.invalidateQueries({ queryKey: ["labor-bookings"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(tractorChannel);
      supabase.removeChannel(laborChannel);
    };
  }, [user?.id, queryClient]);
};

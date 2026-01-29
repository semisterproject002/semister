import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;

export const useUserOrders = () => {
  return useQuery({
    queryKey: ["orders", "user"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      order, 
      items 
    }: { 
      order: Omit<TablesInsert<"orders">, "id" | "created_at" | "updated_at">;
      items: Omit<TablesInsert<"order_items">, "id" | "created_at" | "order_id">[];
    }) => {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(order)
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        ...item,
        order_id: orderData.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      
      if (itemsError) throw itemsError;

      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Admin hooks
export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAllTractorBookings = () => {
  return useQuery({
    queryKey: ["tractor-bookings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tractor_bookings")
        .select(`
          *,
          tractors (name, model)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAllLaborBookings = () => {
  return useQuery({
    queryKey: ["labor-bookings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labor_bookings")
        .select(`
          *,
          labor_workers (full_name, skill)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as any })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateTractorBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("tractor_bookings")
        .update({ status: status as any })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tractor-bookings"] });
    },
  });
};

export const useUpdateLaborBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("labor_bookings")
        .update({ status: status as any })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-bookings"] });
    },
  });
};

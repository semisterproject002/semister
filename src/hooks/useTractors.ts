import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Tractor = Tables<"tractors">;
export type TractorBooking = Tables<"tractor_bookings">;

export const useTractors = () => {
  return useQuery({
    queryKey: ["tractors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tractors")
        .select("*")
        .eq("is_available", true)
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as Tractor[];
    },
  });
};

export const useUserTractorBookings = () => {
  return useQuery({
    queryKey: ["tractor-bookings", "user"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tractor_bookings")
        .select(`
          *,
          tractors (name, model, horsepower)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTractorBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<TablesInsert<"tractor_bookings">, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("tractor_bookings")
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tractor-bookings"] });
    },
  });
};

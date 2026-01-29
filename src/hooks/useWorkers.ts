import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, Database } from "@/integrations/supabase/types";

export type Worker = Tables<"labor_workers">;
export type LaborBooking = Tables<"labor_bookings">;
export type LaborSkill = Database["public"]["Enums"]["labor_skill"];

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labor_workers")
        .select("*")
        .eq("is_verified", true)
        .eq("is_available", true)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data as Worker[];
    },
  });
};

export const useWorkersBySkill = (skill: string) => {
  return useQuery({
    queryKey: ["workers", skill],
    queryFn: async () => {
      let query = supabase
        .from("labor_workers")
        .select("*")
        .eq("is_verified", true)
        .eq("is_available", true);
      
      if (skill !== "all") {
        query = query.eq("skill", skill as LaborSkill);
      }
      
      const { data, error } = await query.order("rating", { ascending: false });
      
      if (error) throw error;
      return data as Worker[];
    },
  });
};

export const useUserLaborBookings = () => {
  return useQuery({
    queryKey: ["labor-bookings", "user"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labor_bookings")
        .select(`
          *,
          labor_workers (full_name, skill, daily_rate)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateLaborBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<TablesInsert<"labor_bookings">, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("labor_bookings")
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-bookings"] });
    },
  });
};

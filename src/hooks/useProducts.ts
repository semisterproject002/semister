import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, Database } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type ProductCategory = Database["public"]["Enums"]["product_category"];

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);
      
      if (category !== "all") {
        query = query.eq("category", category as ProductCategory);
      }
      
      const { data, error } = await query.order("name", { ascending: true });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

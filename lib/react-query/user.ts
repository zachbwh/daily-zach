import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";

export type User = {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url?: string;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("id, user_id, display_name, profile_image_url")
        .limit(1);
      return data![0];
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (
      user: Partial<Omit<User, "id" | "user_id" | "created_at">>
    ) => {
      return supabase
        .from("users")
        .insert(user)
        .select("id, user_id, display_name, profile_image_url");
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["comments"], (old: User) => result.data![0]);
    },
  });
};

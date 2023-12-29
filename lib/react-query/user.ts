import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";

export type User = {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url?: string;
  is_zach: boolean;
  vertical: string;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id!;
      const { data } = await supabase
        .from("users")
        .select(
          "id, user_id, display_name, profile_image_url, is_zach, vertical"
        )
        .eq("user_id", userId)
        .limit(1);
      return data![0];
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (
      user: Partial<Omit<User, "id" | "user_id" | "created_at">>
    ) => {
      return supabase
        .from("users")
        .insert(user)
        .select(
          "id, user_id, display_name, profile_image_url, is_zach, vertical"
        );
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["user"], (old: User) => result.data![0]);
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      user: Partial<Omit<User, "id" | "user_id" | "created_at">>;
    }) => {
      return supabase
        .from("users")
        .update(params.user)
        .eq("id", params.userId)
        .select(
          "id, user_id, display_name, profile_image_url, is_zach, vertical"
        );
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["user"], (old: User) => result.data![0]);
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select(
          "id, user_id, display_name, profile_image_url, is_zach, vertical"
        )
        .eq("user_id", userId)
        .limit(1);
      return data![0];
    },
  });
};

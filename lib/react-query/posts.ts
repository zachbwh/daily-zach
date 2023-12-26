import { supabase } from "@lib/supabase";
import { useQuery } from "@tanstack/react-query";

export type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
};

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, image_url, inserted_at")
        .order("inserted_at", { ascending: false });
      return data;
    },
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, image_url, inserted_at")
        .eq("id", postId)
        .limit(1);
      return (data || [])[0];
    },
    enabled: !!postId,
  });
};

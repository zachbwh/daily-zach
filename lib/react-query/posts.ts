import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
  user_id: string;
  comments: { count: number }[];
};

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count)"
        )
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
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count)"
        )
        .eq("id", postId)
        .limit(1);
      return (data || [])[0];
    },
    enabled: !!postId,
  });
};

export const useInsertPost = () => {
  return useMutation({
    mutationFn: async (post: Omit<Post, "id" | "inserted_at">) => {
      return supabase
        .from("posts")
        .insert(post)
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count)"
        );
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const optimisticPost: Post = {
        id: uuidv4(),
        image_url: variables.image_url,
        inserted_at: new Date().toISOString(),
        user_id: "",
        comments: [{ count: 0 }],
      };
      console.log("Optimistic Post", optimisticPost);
      queryClient.setQueryData(["posts"], (old: Post[]) => [
        optimisticPost,
        ...old,
      ]);

      return { optimisticPostId: optimisticPost.id };
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["posts"], (old: Post[]) =>
        old.map((post) =>
          post.id === context.optimisticPostId ? result.data![0] : post
        )
      );
    },
    onError: (error, variables, context) => {
      // Remove optimistic todo from the todos list
      queryClient.setQueryData(["posts"], (old: Post[]) =>
        old.filter((post) => post.id !== context?.optimisticPostId)
      );
    },
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      return supabase.from("posts").delete().eq("id", postId);
    },
    onSuccess: (result, postId, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["posts"], (old: Post[]) =>
        old.filter((post) => post.id !== postId)
      );
    },
  });
};

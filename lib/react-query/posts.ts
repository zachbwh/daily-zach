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
  location: string | null;
  caption: string | null;
};

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count), location, caption"
        )
        .order("inserted_at", { ascending: false });
      return data;
    },
  });
};

type SinglePost = {
  id: any;
  image_url: any;
  inserted_at: any;
  user_id: any;
  comments: {
    count: any;
  }[];
  post_requests: {
    status: any;
    users: {
      display_name: any;
      profile_image_url: any;
    };
  };
  location: any;
  caption: any;
};

export const usePost = (postId: string) => {
  return useQuery<SinglePost>({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count), post_requests(status, users(display_name, profile_image_url)), location, caption"
        )
        .eq("id", postId)
        .limit(1);
      return (data || [])[0] as unknown as SinglePost;
    },
    enabled: !!postId,
  });
};

export const useInsertPost = () => {
  return useMutation({
    mutationFn: async (
      post: Omit<Post, "id" | "inserted_at" | "user_id" | "comments">
    ) => {
      return supabase
        .from("posts")
        .insert(post)
        .select(
          "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count), location, caption"
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
        location: variables.location,
        caption: variables.caption,
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

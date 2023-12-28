import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  text: string;
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("comments")
        .select("id, post_id, user_id, parent_id, created_at, text")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
      return data;
    },
  });
};

export const useInsertComment = () => {
  return useMutation({
    mutationFn: async (
      comment: Omit<Comment, "id" | "user_id" | "created_at">
    ) => {
      return supabase
        .from("comments")
        .insert(comment)
        .select("id, post_id, user_id, parent_id, created_at, text");
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const userId = (await supabase.auth.getSession()).data.session?.user.id!;

      const optimisticComment: Comment = {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        post_id: variables.post_id,
        user_id: userId,
        parent_id: variables.parent_id,
        text: variables.text,
      };
      console.log("Optimistic Comment", optimisticComment);
      queryClient.setQueryData(["comments"], (old: Comment[]) => [
        optimisticComment,
        ...old,
      ]);

      return { optimisticCommentId: optimisticComment.id };
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(["comments"], (old: Comment[]) =>
        old.map((comment) =>
          comment.id === context.optimisticCommentId ? result.data![0] : comment
        )
      );
    },
    onError: (error, variables, context) => {
      // Remove optimistic todo from the todos list
      queryClient.setQueryData(["comments"], (old: Comment[]) =>
        old.filter((comment) => comment.id !== context?.optimisticCommentId)
      );
    },
  });
};

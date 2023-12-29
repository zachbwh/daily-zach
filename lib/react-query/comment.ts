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

const SELECT_COMMENTS = "id, post_id, user_id, parent_id, created_at, text";

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("comments")
        .select(SELECT_COMMENTS)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      return data;
    },
  });
};

export const useInsertComment = () => {
  return useMutation({
    mutationFn: async (
      comment: Omit<Comment, "id" | "user_id" | "created_at" | "users">
    ) => {
      return supabase.from("comments").insert(comment).select(SELECT_COMMENTS);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", variables.post_id],
      });
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
      queryClient.setQueryData(
        ["comments", variables.post_id],
        (old: Comment[]) => [...old, optimisticComment]
      );

      return { optimisticCommentId: optimisticComment.id };
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result);
      queryClient.setQueryData(
        ["comments", variables.post_id],
        (old: Comment[]) =>
          old.map((comment) =>
            comment.id === context.optimisticCommentId
              ? result.data![0]
              : comment
          )
      );
    },
    onError: (error, variables, context) => {
      // Remove optimistic todo from the todos list
      queryClient.setQueryData(
        ["comments", variables.post_id],
        (old: Comment[]) =>
          old.filter((comment) => comment.id !== context?.optimisticCommentId)
      );
    },
  });
};

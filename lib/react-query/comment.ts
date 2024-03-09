import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

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
  useEffect(() => {
    let channel: RealtimeChannel | undefined;
    if (postId) {
      channel = supabase
        .channel("post_comments_added")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "comments",
            filter: `post_id=eq.${postId}`,
          },
          (payload) => {
            const newComment = payload.new as Comment;
            console.log("new comment", newComment);
            queryClient.setQueryData(["comments", postId], (old: Comment[]) => {
              if (
                !old.some(
                  (oldComment: Comment) => oldComment.id === newComment.id
                )
              ) {
                return [...old, newComment];
              }
              return old;
            });
          }
        )
        .subscribe();
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [postId]);
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
        id: "",
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
          old.map((comment) => (comment.id === "" ? result.data![0] : comment))
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

export const useDeleteComment = (postId: string) => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      return supabase.from("comments").delete().eq("id", commentId);
    },
    onSuccess: (result, commentId) => {
      console.log("Sucess Response", result);
      queryClient.setQueryData(["comments", postId], (old: Comment[]) =>
        old.filter((comment) => comment.id !== commentId)
      );
    },
  });
};

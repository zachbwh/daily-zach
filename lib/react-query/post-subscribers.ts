import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";

export type PostSubscriber = {
  post_id: string;
  is_subscribed: boolean;
};

export const useIsSubscribedToPost = (postId: string) => {
  return useQuery({
    queryKey: ["post_subscribers", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_subscribers")
        .select("post_id, is_subscribed")
        .eq("post_id", postId);
      return data;
    },
  });
};

export const useUpdatePostSubscription = () => {
  return useMutation({
    mutationFn: async (postSubscriber: PostSubscriber) => {
      return supabase
        .from("post_subscribers")
        .update(postSubscriber)
        .eq("post_id", postSubscriber.post_id)
        .select("post_id, is_subscribed");
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(
        ["post_subscribers", variables.post_id],
        (old: PostSubscriber) => result.data
      );
    },
  });
};

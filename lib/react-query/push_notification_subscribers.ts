import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";

export type PushNotification = {
  subscription_token: string;
};

export const usePushNotificationSubscriptions = () => {
  return useQuery({
    queryKey: ["push_notification_subscriber"],
    queryFn: async () => {
      const { data } = await supabase
        .from("push_notification_subscribers")
        .select("subscription_token");
      return data;
    },
  });
};

export const useInsertPushNotificationSubscriber = () => {
  return useMutation({
    mutationFn: async (pushNotification: PushNotification) => {
      return supabase
        .from("push_notification_subscribers")
        .insert(pushNotification);
    },
    onSuccess: (result, variables, context) => {
      console.log("Sucess Response", result.data);
      queryClient.setQueryData(
        ["push_notification_subscriber"],
        (old: PushNotification[]) => [...old, ...(result.data || [])]
      );
    },
  });
};

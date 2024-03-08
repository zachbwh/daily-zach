import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "./client";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

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

export const useLogoutPushNotificationSubscriber = () => {
  return useMutation({
    mutationFn: async () => {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      ).data;
      return supabase
        .from("push_notification_subscribers")
        .delete()
        .eq("subscription_token", token);
    },
  });
};

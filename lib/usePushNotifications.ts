import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "./supabase";

export interface PushNotificationsState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

type PushNotification = {
  subscription_token: string;
};

export const usePushNotifications = (): PushNotificationsState => {
  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      ).data;
      console.log(token);

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) =>
        token &&
        setExpoPushToken(token as unknown as Notifications.ExpoPushToken)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
        setNotification(notification);

        // Notifications.scheduleNotificationAsync({
        //     content: {
        //       title: notification.request.content.title,
        //       body: notification.request.content.body,
        //     },
        //     trigger: null,
        //   });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const [pushNotifications, setPushNotifications] =
    useState<PushNotification[]>();
  useEffect(() => {
    supabase
      .from("push_notification_subscribers")
      .select("subscription_token")
      .then((data) => {
        if (data.data) {
          setPushNotifications(data.data as PushNotification[]);
        }
      });
  }, []);

  const insertPushNotificationToken = useCallback(async () => {
    if (
      pushNotifications &&
      expoPushToken &&
      !pushNotifications
        .map((pushNotifications) => pushNotifications.subscription_token)
        .includes(expoPushToken as unknown as string)
    ) {
      const { error: insertError, data: insertData } = await supabase
        .from("push_notification_subscribers")
        .insert({ subscription_token: expoPushToken });
      if (insertError) {
        console.error("failed to upload push token data", {
          insertError,
        });
        // Handle error
        return;
      }
      console.log("inserted push token into db", insertData);
    }
  }, [pushNotifications, expoPushToken]);

  useEffect(() => {
    void insertPushNotificationToken();
  }, [pushNotifications, expoPushToken]);

  return { expoPushToken, notification };
};

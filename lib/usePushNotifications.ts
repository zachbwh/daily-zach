import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  useInsertPushNotificationSubscriber,
  usePushNotificationSubscriptions,
} from "@lib/react-query/push_notification_subscribers";
import handlePostRequest from "@lib/notifications/handlers/post-request";
import { router } from "expo-router";

export interface PushNotificationsState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

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
        handleNotification: async (notification) => {
          const { type } = notification.request.content.data;
          if (type === "POST_REQUEST") {
            return await handlePostRequest(notification);
          }
          return {
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        },
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
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data["url"];
        if (url) {
          router.push(url);
        }
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

  const { data: pushNotifications } = usePushNotificationSubscriptions();
  const { mutate: insertPushNotificationToken } =
    useInsertPushNotificationSubscriber();

  useEffect(() => {
    if (
      pushNotifications &&
      expoPushToken &&
      !pushNotifications
        .map((pushNotifications) => pushNotifications.subscription_token)
        .includes(expoPushToken as unknown as string)
    ) {
      try {
        void insertPushNotificationToken({
          subscription_token: expoPushToken as unknown as string,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [pushNotifications, expoPushToken]);

  return { expoPushToken, notification };
};

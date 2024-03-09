import * as Notifications from "expo-notifications";
import {
  AndroidNotificationPriority,
  NotificationBehavior,
} from "expo-notifications";

const handlePostRequest = async (
  notification: Notifications.Notification
): Promise<NotificationBehavior> => {
  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: AndroidNotificationPriority.HIGH,
  };
};

export default handlePostRequest;

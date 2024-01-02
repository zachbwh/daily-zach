import { RequestStatus } from "@app/requests/types";
import { supabase } from "@lib/supabase";
import * as Notifications from "expo-notifications";
import {
  AndroidNotificationPriority,
  NotificationBehavior,
} from "expo-notifications";

const handlePostRequest = async (
  notification: Notifications.Notification
): Promise<NotificationBehavior> => {
  const requestId = notification.request.content.data["request_id"];

  try {
    // await supabase
    //   .from("post_requests")
    //   .update({ status: RequestStatus.DELIVERED })
    //   .eq("id", requestId)
    //   .select("id, created_at, requestor_id, status, post_id");
  } catch (error) {
    console.error("Failure updating post request status", error);
  }

  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: AndroidNotificationPriority.MAX,
  };
};

export default handlePostRequest;

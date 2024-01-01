import { RequestStatus } from "@app/requests/types";
import { supabase } from "@lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import queryClient from "./client";
import { RealtimeChannel } from "@supabase/supabase-js";

export type PostRequest = {
  id: string;
  created_at: string;
  requestor_id: string;
  post_id: string | null;
  status: RequestStatus;
};

export const usePostRequest = (requestId: string) => {
  useEffect(() => {
    let channel: RealtimeChannel | undefined;
    if (requestId) {
      channel = supabase
        .channel("post_request_status_updates")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "post_requests",
            filter: `id=eq.${requestId}`,
          },
          (payload) => {
            const newStatus = payload.new.status as RequestStatus;
            queryClient.setQueryData(
              ["post_requests", requestId],
              (old: PostRequest) => {
                return {
                  ...old,
                  status: newStatus,
                };
              }
            );
          }
        )
        .subscribe();
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [requestId]);
  return useQuery({
    queryKey: ["post_requests", requestId],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_requests")
        .select("id, created_at, requestor_id, post_id, status")
        .eq("id", requestId)
        .limit(1);
      return (data || [])[0];
    },
    enabled: !!requestId,
  });
};

export const useInsertPostRequest = () => {
  return useMutation({
    mutationFn: async () => {
      return supabase
        .from("post_requests")
        .insert({})
        .select("id, created_at, requestor_id, status, post_id");
    },
  });
};

export const useUpdatePostRequest = () => {
  return useMutation({
    mutationFn: async (params: {
      requestId: string;
      status: RequestStatus;
    }) => {
      return supabase
        .from("post_requests")
        .update({ status: params.status })
        .eq("id", params.requestId)
        .select("id, created_at, requestor_id, status, post_id");
    },
  });
};

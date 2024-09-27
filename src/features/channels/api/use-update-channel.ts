/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  name: string;
  workspaceId: Id<"workspaces">;
  channelId: Id<"channels">;
};
type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess?: (data: Id<"channels">) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateChannel = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => {
    return status === "pending";
  }, [status]);
  const isError = useMemo(() => {
    return status === "error";
  }, [status]);
  const isSettled = useMemo(() => {
    return status === "settled";
  }, [status]);
  const isSuccess = useMemo(() => {
    return status === "success";
  }, [status]);

  const mutation = useMutation(api.channels.update);

  const mutate: (
    values: RequestType,
    options?: Options
  ) => Promise<
    | (string & {
        __tableName: "channels";
      })
    | undefined
  > = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isError, isSuccess, isSettled };
};

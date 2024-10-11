"use client";

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/features/members/api/use-member-id";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversation from "./conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversations();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (id) => setConversationId(id),
        onError: () => {
          toast.error("Failed to create or get conversation.");
        },
      }
    );
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="size-6 text-muted-foreground" />

        <span className="text-sm text-muted-foreground">
          Conversation not found.
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;

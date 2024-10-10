"use client";

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/features/members/api/use-member-id";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";

const MemberIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();

  const { mutate, isPending } = useCreateOrGetConversations();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (id) => {
          setConversationId(id);
        },
        onError: () => {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>;
  }

  if (!conversationId) {
    <div className="h-full flex items-center justify-center">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Conversation not found
      </span>
    </div>;
  }

  return <div>
    {
        JSON.stringify(conversationId)
    }
  </div>;
};

export default MemberIdPage;

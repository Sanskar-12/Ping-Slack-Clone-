import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessageById } from "../api/use-get-message-by-id";
import Message from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessageById({
    messageId,
  });

  if (isLoadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="animate-spin size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  if (!message) {
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5  text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    </div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <Message
        hideThreadButton
        memberId={message!.memberId}
        authorName={message?.user.name}
        authorImage={message?.user.image}
        isAuthor={currentMember?._id === message?.memberId}
        body={message!.body}
        image={message?.image}
        createdAt={message!._creationTime}
        updatedAt={message!.updatedAt}
        id={message!._id}
        reactions={message!.reactions}
        isEditing={editingId === message?._id}
        setEditingId={setEditingId}
      />
    </div>
  );
};

export default Thread;

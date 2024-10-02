import { useChannelId } from "@/features/channels/api/use-workspace-id";
import { useCreateMessages } from "@/features/messages/api/use-create-message";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

// cant use the quill in server side because quill doesnt support server side rendering and nextjs does ssr so we have do dynamic import by doing ssr = false
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();

  const { mutate: createMessage } = useCreateMessages();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      await createMessage(
        {
          body,
          channelId,
          workspaceId,
        },
        {
          throwError: true,
        }
      );

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;

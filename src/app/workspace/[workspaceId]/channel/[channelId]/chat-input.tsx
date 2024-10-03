import { useChannelId } from "@/features/channels/api/use-workspace-id";
import { useCreateMessages } from "@/features/messages/api/use-create-message";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

// cant use the quill in server side because quill doesnt support server side rendering and nextjs does ssr so we have do dynamic import by doing ssr = false
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
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
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const imageUrl = await generateUploadUrl({}, { throwError: true });

        if (!imageUrl) {
          throw new Error("Url not found");
        }

        const result = await fetch(imageUrl, {
          method: "POST",
          headers: { "Content-Type": image!.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
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

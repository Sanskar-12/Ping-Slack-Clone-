import { useMemberProfileId } from "@/features/members/store/use-member-profile-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const [memberProfileId, setMemberProfileId] = useMemberProfileId();

  const onOpenProfile = (memberId: string) => {
    setMemberProfileId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setMemberProfileId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setMemberProfileId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
    onOpenProfile,
    memberProfileId,
  };
};

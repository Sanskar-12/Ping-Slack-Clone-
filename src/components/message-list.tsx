import { GetMessageReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./message";
import ChannelHero from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { Loader } from "lucide-react";
import ConversationHero from "./conversation-hero";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessageReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}; // if the message was Yesterday's or Today's this will return me "Yesterday" or "Today" if not then this will return me date in string

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkSpaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  // groupedMessages will return me an object which has the key as the date and the value will the array of messages which has the creationTime that of the key
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data> // --->sample  { "2024-07-22": [{messages}] }
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            // this will be only true if the difference in time between prevMessage and curr message will be less than 5 mins
            const isCompact =
              prevMessage &&
              prevMessage?.user?._id === message?.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message?._id}
                id={message?._id}
                memberId={message?.memberId}
                authorImage={message?.user?.image}
                authorName={message?.user?.name}
                reactions={message?.reactions}
                body={message?.body}
                image={message?.image}
                updatedAt={message?.updatedAt}
                createdAt={message?._creationTime}
                threadCount={message?.threadCount}
                threadImage={message?.threadImage}
                threadName={message?.threadName}
                threadTimestamp={message?.threadTimestamp}
                isAuthor={message?.memberId === currentMember?._id}
                isEditing={editingId === message?._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) loadMore();
              },
              { threshold: 1.0 }
            );

            observer.observe(el);

            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && (
        <ConversationHero memberName={memberName} memberImage={memberImage} />
      )}
    </div>
  );
};

export default MessageList;

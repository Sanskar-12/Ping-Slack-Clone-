import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  onClick?: () => void;
  name?: string;
}

const ThreadBar = ({
  count,
  image,
  timestamp,
  onClick,
  name = "Member",
}: ThreadBarProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  if (!count || !timestamp) return null;

  return (
    <button
      onClick={onClick}
      className="group/thread-bar flex max-w-[600px] items-center justify-start rounded-md border border-transparent p-1 transition hover:border-border hover:bg-white"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="rounded-full">
          <AvatarImage src={image} alt="image" className="rounded-full" />
          <AvatarFallback className="rounded-full bg-sky-500 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="block truncate text-xs text-muted-foreground group-hover/thread-bar:hidden">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="hidden truncate text-xs text-muted-foreground group-hover/thread-bar:block">
          View thread
        </span>
      </div>
      <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover/thread-bar:opacity-100" />
    </button>
  );
};

export default ThreadBar;

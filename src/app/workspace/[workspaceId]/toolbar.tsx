import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Info, Search } from "lucide-react";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

const Toolbar = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data } = useGetWorkSpace({ id: workspaceId });
  const { data: members } = useGetMembers({ workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });

  const onChannelClick = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel?._id}
                  onSelect={() => onChannelClick(channel?._id)}
                >
                  {channel?.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member?._id}
                  onSelect={() => onMemberClick(member?._id)}
                >
                  {member?.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;

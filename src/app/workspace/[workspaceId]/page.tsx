"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelsModal } from "@/features/channels/store/use-create-channels-modal";
import { useGetWorkSpaceInfoById } from "@/features/workspaces/api/use-get-workspace-info";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-members";

const WorkSpaceIdPage = () => {
  const router = useRouter();
  const workspaceId: Id<"workspaces"> = useWorkSpaceId();
  const [open, setOpen] = useCreateChannelsModal();
  const {data:member,isLoading:memberLoading}=useCurrentMember({workspaceId})

  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkSpaceInfoById({
      id: workspaceId,
    });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member ||  !workspace) {
      return;
    }

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && workspace.role === "admin") {
      setOpen(true);
    }
  }, [
    member,
    memberLoading,
    workspace,
    workspaceLoading,
    channelsLoading,
    channelId,
    router,
    workspaceId,
    open,
    setOpen,
  ]);

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !workspaceId) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6" />
      <span className="text-sm text-muted-foreground">
        No channel found
      </span>
    </div>
  );
};

export default WorkSpaceIdPage;

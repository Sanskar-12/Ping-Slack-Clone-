"use client";

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import { ReactNode } from "react";
import Sidebar from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkSpaceSidebar from "./workspace-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/features/messages/components/thread";
import Profile from "@/components/profile";

interface WorkSpaceIdLayoutProps {
  children: ReactNode;
}

const WorkSpaceIdLayout = ({ children }: WorkSpaceIdLayoutProps) => {
  const { parentMessageId, onClose, memberProfileId } = usePanel();

  const showPanel = !!parentMessageId || !!memberProfileId;
  return (
    <div className="h-full">
      <Toaster />
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkSpaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : memberProfileId ? (
                  <Profile
                    memberId={memberProfileId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkSpaceIdLayout;

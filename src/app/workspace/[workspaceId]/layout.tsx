"use client"

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import { ReactNode } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkSpaceIdLayoutProps {
  children: ReactNode;
  params:{
    workspaceId:Id<"workspaces">
  }
}

const WorkSpaceIdLayout = ({ children,params:{workspaceId} }: WorkSpaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar workspaceId={workspaceId}/>
      {children}
    </div>
  );
};

export default WorkSpaceIdLayout;

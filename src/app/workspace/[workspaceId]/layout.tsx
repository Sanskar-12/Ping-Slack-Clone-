"use client";

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import { ReactNode } from "react";
import Sidebar from "./sidebar";

interface WorkSpaceIdLayoutProps {
  children: ReactNode;
}

const WorkSpaceIdLayout = ({
  children,
}: WorkSpaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default WorkSpaceIdLayout;
